// Manual event tags, backed by the backend account (/api/events).
// Purely user-managed — no LLM ever assigns these. The store keeps the same
// zustand hook shape as before, but the account is now the source of truth:
// state hydrates from the backend on app load, mutations update locally
// (optimistic) and sync fire-and-forget. The old localStorage store is
// migrated to the account once, then retired.
import { useEffect } from "react";
import { create } from "zustand";

import { req } from "@/lib/api/client";

export type EventColor = "amber" | "blue" | "rose" | "green" | "violet" | "slate";

export const EVENT_COLORS: EventColor[] = ["amber", "blue", "rose", "green", "violet", "slate"];

export interface EventItem {
  id: string;
  name: string;
  color: EventColor;
}

interface EventsSnapshot {
  events: EventItem[];
  assignments: Record<string, string>;
}

interface EventsState {
  events: EventItem[];
  emailEventMap: Record<string, string | undefined>;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addEvent: (name: string, color?: EventColor) => EventItem;
  renameEvent: (id: string, name: string) => void;
  recolorEvent: (id: string, color: EventColor) => void;
  deleteEvent: (id: string) => void;
  setEmailEvent: (emailId: string, eventId: string | null) => void;
}

const LEGACY_KEY = "emailos-events-v1";

function readLegacy(): { events: EventItem[]; emailEventMap: Record<string, string> } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const state = parsed?.state;
    if (!state || !Array.isArray(state.events)) return null;
    return { events: state.events, emailEventMap: state.emailEventMap ?? {} };
  } catch {
    return null;
  }
}

async function migrateLegacy(legacy: { events: EventItem[]; emailEventMap: Record<string, string> }) {
  for (const ev of legacy.events) {
    await req("/api/events", { method: "POST", body: JSON.stringify(ev) });
  }
  for (const [emailId, eventId] of Object.entries(legacy.emailEventMap)) {
    if (!eventId) continue;
    await req(`/api/events/assignments/${emailId}`, {
      method: "PUT",
      body: JSON.stringify({ event_id: eventId }),
    });
  }
  window.localStorage.removeItem(LEGACY_KEY);
}

export const useEventsStore = create<EventsState>()((set, get) => ({
  events: [],
  emailEventMap: {},
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return;
    try {
      let snap = await req<EventsSnapshot>("/api/events");
      // One-time migration: this browser has tags from the old localStorage
      // era but the account has none yet — push them up, then re-fetch.
      if (snap.events.length === 0) {
        const legacy = readLegacy();
        if (legacy && legacy.events.length > 0) {
          await migrateLegacy(legacy);
          snap = await req<EventsSnapshot>("/api/events");
        }
      }
      set({ events: snap.events, emailEventMap: snap.assignments, hydrated: true });
    } catch {
      // Backend unreachable: fall back to read-only legacy data so the UI
      // still shows something; hydration retries on next app load.
      const legacy = readLegacy();
      if (legacy) set({ events: legacy.events, emailEventMap: legacy.emailEventMap });
    }
  },

  addEvent: (name, color = "slate") => {
    const ev: EventItem = {
      id: `evt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      color,
    };
    set((s) => ({ events: [...s.events, ev] }));
    void req("/api/events", { method: "POST", body: JSON.stringify(ev) }).catch(() => {});
    return ev;
  },

  renameEvent: (id, name) => {
    set((s) => ({
      events: s.events.map((e) => (e.id === id ? { ...e, name: name.trim() } : e)),
    }));
    void req(`/api/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: name.trim() }),
    }).catch(() => {});
  },

  recolorEvent: (id, color) => {
    set((s) => ({
      events: s.events.map((e) => (e.id === id ? { ...e, color } : e)),
    }));
    void req(`/api/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ color }),
    }).catch(() => {});
  },

  deleteEvent: (id) => {
    set((s) => {
      const map = { ...s.emailEventMap };
      for (const k of Object.keys(map)) if (map[k] === id) delete map[k];
      return { events: s.events.filter((e) => e.id !== id), emailEventMap: map };
    });
    void req(`/api/events/${id}`, { method: "DELETE" }).catch(() => {});
  },

  setEmailEvent: (emailId, eventId) => {
    set((s) => {
      const map = { ...s.emailEventMap };
      if (!eventId) delete map[emailId];
      else map[emailId] = eventId;
      return { emailEventMap: map };
    });
    void req(`/api/events/assignments/${emailId}`, {
      method: "PUT",
      body: JSON.stringify({ event_id: eventId }),
    }).catch(() => {});
  },
}));

/** Call once inside the signed-in app shell to load tags from the account. */
export function useHydrateEvents() {
  const hydrate = useEventsStore((s) => s.hydrate);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);
}

const COLOR_CLASSES: Record<EventColor, { pill: string; dot: string; chip: string; chipActive: string }> = {
  amber: {
    pill: "bg-amber-100 text-amber-900 border-amber-200",
    dot: "bg-amber-500",
    chip: "border-amber-200 text-amber-900 hover:bg-amber-50",
    chipActive: "bg-amber-100 border-amber-300 text-amber-900",
  },
  blue: {
    pill: "bg-blue-100 text-blue-900 border-blue-200",
    dot: "bg-blue-500",
    chip: "border-blue-200 text-blue-900 hover:bg-blue-50",
    chipActive: "bg-blue-100 border-blue-300 text-blue-900",
  },
  rose: {
    pill: "bg-rose-100 text-rose-900 border-rose-200",
    dot: "bg-rose-500",
    chip: "border-rose-200 text-rose-900 hover:bg-rose-50",
    chipActive: "bg-rose-100 border-rose-300 text-rose-900",
  },
  green: {
    pill: "bg-emerald-100 text-emerald-900 border-emerald-200",
    dot: "bg-emerald-500",
    chip: "border-emerald-200 text-emerald-900 hover:bg-emerald-50",
    chipActive: "bg-emerald-100 border-emerald-300 text-emerald-900",
  },
  violet: {
    pill: "bg-violet-100 text-violet-900 border-violet-200",
    dot: "bg-violet-500",
    chip: "border-violet-200 text-violet-900 hover:bg-violet-50",
    chipActive: "bg-violet-100 border-violet-300 text-violet-900",
  },
  slate: {
    pill: "bg-slate-100 text-slate-800 border-slate-200",
    dot: "bg-slate-500",
    chip: "border-slate-200 text-slate-800 hover:bg-slate-50",
    chipActive: "bg-slate-100 border-slate-300 text-slate-900",
  },
};

export function eventColorClasses(color: EventColor) {
  return COLOR_CLASSES[color] ?? COLOR_CLASSES.slate;
}
