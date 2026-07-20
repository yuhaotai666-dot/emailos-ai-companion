import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockKnowledge } from "./mock-data";

export interface KnowledgeEntry {
  id: string;
  title: string;
  detail: string;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  entries: KnowledgeEntry[];
}

interface KnowledgeState {
  bases: KnowledgeBase[];
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

const uid = () => Math.random().toString(36).slice(2, 10);

const defaultDetail = (title: string) =>
  `Detailed guidance for "${title}". Click edit to describe when and how Ivy should apply this knowledge — examples, tone notes, or exceptions.`;

const seed: KnowledgeBase[] = Object.entries(mockKnowledge).map(([name, items]) => ({
  id: uid(),
  name,
  entries: (items as string[]).map((t) => ({
    id: uid(),
    title: t,
    detail: defaultDetail(t),
  })),
}));

export const useKnowledgeStore = create<KnowledgeState>()(
  persist(
    (set) => ({
      bases: seed,
      addBase: (name) =>
        set((s) => ({ bases: [...s.bases, { id: uid(), name, entries: [] }] })),
      renameBase: (id, name) =>
        set((s) => ({ bases: s.bases.map((b) => (b.id === id ? { ...b, name } : b)) })),
      deleteBase: (id) => set((s) => ({ bases: s.bases.filter((b) => b.id !== id) })),
      addKnowledge: (baseId, title, detail) =>
        set((s) => ({
          bases: s.bases.map((b) =>
            b.id === baseId
              ? {
                  ...b,
                  entries: [
                    ...b.entries,
                    { id: uid(), title, detail: detail ?? defaultDetail(title) },
                  ],
                }
              : b,
          ),
        })),
      updateKnowledge: (baseId, entryId, patch) =>
        set((s) => ({
          bases: s.bases.map((b) =>
            b.id === baseId
              ? {
                  ...b,
                  entries: b.entries.map((e) => (e.id === entryId ? { ...e, ...patch } : e)),
                }
              : b,
          ),
        })),
      deleteKnowledge: (baseId, entryId) =>
        set((s) => ({
          bases: s.bases.map((b) =>
            b.id === baseId ? { ...b, entries: b.entries.filter((e) => e.id !== entryId) } : b,
          ),
        })),
    }),
    { name: "ivy-knowledge-v1" },
  ),
);
