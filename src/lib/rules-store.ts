// Agent Rules (the user's standing directives) — backed by the account
// profile (/api/profile.agent_rules), not localStorage, so the backend agent
// actually reads them and they follow the account across devices.
import { useEffect } from "react";
import { create } from "zustand";

import { req } from "@/lib/api/client";
import type { ApiUserProfile } from "@/lib/api/types";

const LEGACY_KEY = "ivy-agent-rules-v2";

interface RulesState {
  text: string;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setText: (text: string) => void;
}

export const useRulesStore = create<RulesState>()((set, get) => ({
  text: "",
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return;
    try {
      const profile = await req<ApiUserProfile>("/api/profile");
      let text = profile.agent_rules ?? "";
      // One-time migration: this browser has rules from the old localStorage
      // era but the account has none yet — push them up.
      if (!text && typeof window !== "undefined") {
        const legacy = window.localStorage.getItem(LEGACY_KEY);
        const parsed = legacy ? JSON.parse(legacy)?.state?.text : "";
        if (parsed) {
          text = parsed;
          await req("/api/profile", {
            method: "PUT",
            body: JSON.stringify({ ...profile, agent_rules: text }),
          });
          window.localStorage.removeItem(LEGACY_KEY);
        }
      }
      set({ text, hydrated: true });
    } catch {
      // Backend unreachable — leave empty; hydration retries next mount.
    }
  },

  setText: (text) => {
    set({ text });
    void (async () => {
      try {
        const profile = await req<ApiUserProfile>("/api/profile");
        await req("/api/profile", {
          method: "PUT",
          body: JSON.stringify({ ...profile, agent_rules: text }),
        });
      } catch {
        /* offline — the local value stays; next save syncs */
      }
    })();
  },
}));

/** Load the account's agent rules once (call on the Settings page). */
export function useHydrateRules() {
  const hydrate = useRulesStore((s) => s.hydrate);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);
}
