// Knowledge (base → entry) — backed by the account (/api/knowledge), not
// localStorage, so the backend agent actually reads it. Base id == its name
// (the backend keys groups by section name). A freshly-created empty base
// lives locally until its first entry is added (empty groups aren't persisted
// server-side). Same optimistic-local + fire-and-forget-sync pattern as
// events-store, plus a one-time localStorage migration.
import { useEffect } from "react";
import { create } from "zustand";

import { req } from "@/lib/api/client";

export interface KnowledgeEntry {
  id: string;
  title: string;
  detail: string;
}

export interface KnowledgeBase {
  id: string; // == name
  name: string;
  entries: KnowledgeEntry[];
}

interface KnowledgeState {
  bases: KnowledgeBase[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addBase: (name: string) => void;
  renameBase: (id: string, name: string) => void;
  deleteBase: (id: string) => void;
  addKnowledge: (baseId: string, title: string, detail?: string) => void;
  updateKnowledge: (
    baseId: string,
    entryId: string,
    patch: Partial<Omit<KnowledgeEntry, "id">>,
  ) => void;
  deleteKnowledge: (baseId: string, entryId: string) => void;
}

const LEGACY_KEY = "ivy-knowledge-v1";
const uid = () => Math.random().toString(36).slice(2, 10);

const defaultDetail = (title: string) =>
  `Detailed guidance for "${title}". Click edit to describe when and how Ivy should apply this knowledge — examples, tone notes, or exceptions.`;

async function migrateLegacy(existing: KnowledgeBase[]): Promise<KnowledgeBase[]> {
  if (typeof window === "undefined") return existing;
  const raw = window.localStorage.getItem(LEGACY_KEY);
  if (!raw) return existing;
  try {
    const legacy: KnowledgeBase[] = JSON.parse(raw)?.state?.bases ?? [];
    for (const base of legacy) {
      for (const entry of base.entries) {
        await req("/api/knowledge/entries", {
          method: "POST",
          body: JSON.stringify({ base: base.name, title: entry.title, detail: entry.detail }),
        });
      }
    }
    window.localStorage.removeItem(LEGACY_KEY);
    return await req<KnowledgeBase[]>("/api/knowledge");
  } catch {
    return existing;
  }
}

export const useKnowledgeStore = create<KnowledgeState>()((set, get) => ({
  bases: [],
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return;
    try {
      let bases = await req<KnowledgeBase[]>("/api/knowledge");
      if (bases.length === 0) bases = await migrateLegacy(bases);
      set({ bases, hydrated: true });
    } catch {
      /* backend offline — retry on next mount */
    }
  },

  addBase: (name) => {
    const clean = name.trim();
    if (!clean || get().bases.some((b) => b.name === clean)) return;
    // Local-only until it gets its first entry (empty groups aren't persisted).
    set((s) => ({ bases: [...s.bases, { id: clean, name: clean, entries: [] }] }));
  },

  renameBase: (id, name) => {
    const clean = name.trim();
    if (!clean) return;
    const base = get().bases.find((b) => b.id === id);
    set((s) => ({
      bases: s.bases.map((b) => (b.id === id ? { ...b, id: clean, name: clean } : b)),
    }));
    if (base && base.entries.length > 0) {
      void req(`/api/knowledge/bases/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({ new_name: clean }),
      }).catch(() => {});
    }
  },

  deleteBase: (id) => {
    const base = get().bases.find((b) => b.id === id);
    set((s) => ({ bases: s.bases.filter((b) => b.id !== id) }));
    if (base && base.entries.length > 0) {
      void req(`/api/knowledge/bases/${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});
    }
  },

  addKnowledge: (baseId, title, detail) => {
    const body = detail ?? defaultDetail(title);
    const tempId = uid();
    set((s) => ({
      bases: s.bases.map((b) =>
        b.id === baseId ? { ...b, entries: [...b.entries, { id: tempId, title, detail: body }] } : b,
      ),
    }));
    void req<KnowledgeEntry>("/api/knowledge/entries", {
      method: "POST",
      body: JSON.stringify({ base: baseId, title, detail: body }),
    })
      .then((saved) =>
        // Swap the optimistic temp id for the real backend id.
        set((s) => ({
          bases: s.bases.map((b) =>
            b.id === baseId
              ? { ...b, entries: b.entries.map((e) => (e.id === tempId ? saved : e)) }
              : b,
          ),
        })),
      )
      .catch(() => {});
  },

  updateKnowledge: (baseId, entryId, patch) => {
    set((s) => ({
      bases: s.bases.map((b) =>
        b.id === baseId
          ? { ...b, entries: b.entries.map((e) => (e.id === entryId ? { ...e, ...patch } : e)) }
          : b,
      ),
    }));
    void req(`/api/knowledge/entries/${entryId}`, {
      method: "PATCH",
      body: JSON.stringify({ title: patch.title, detail: patch.detail }),
    }).catch(() => {});
  },

  deleteKnowledge: (baseId, entryId) => {
    set((s) => ({
      bases: s.bases.map((b) =>
        b.id === baseId ? { ...b, entries: b.entries.filter((e) => e.id !== entryId) } : b,
      ),
    }));
    void req(`/api/knowledge/entries/${entryId}`, { method: "DELETE" }).catch(() => {});
  },
}));

/** Load the account's knowledge once (call on the Knowledge page). */
export function useHydrateKnowledge() {
  const hydrate = useKnowledgeStore((s) => s.hydrate);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);
}
