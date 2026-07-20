import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockMemory } from "./mock-data";

export interface MemoryRule {
  id: string;
  title: string;
  detail: string;
}

export interface MemoryBase {
  id: string;
  name: string;
  rules: MemoryRule[];
}

interface MemoryState {
  bases: MemoryBase[];
  addBase: (name: string) => void;
  renameBase: (id: string, name: string) => void;
  deleteBase: (id: string) => void;
  addRule: (baseId: string, title: string, detail?: string) => void;
  updateRule: (baseId: string, ruleId: string, patch: Partial<Omit<MemoryRule, "id">>) => void;
  deleteRule: (baseId: string, ruleId: string) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

const defaultDetail = (title: string) =>
  `Detailed guidance for "${title}". Click edit to describe when and how Ivy should apply this rule — examples, tone notes, or exceptions.`;

const seed: MemoryBase[] = Object.entries(mockMemory).map(([name, items]) => ({
  id: uid(),
  name,
  rules: (items as string[]).map((t) => ({
    id: uid(),
    title: t,
    detail: defaultDetail(t),
  })),
}));

export const useMemoryStore = create<MemoryState>()(
  persist(
    (set) => ({
      bases: seed,
      addBase: (name) =>
        set((s) => ({ bases: [...s.bases, { id: uid(), name, rules: [] }] })),
      renameBase: (id, name) =>
        set((s) => ({ bases: s.bases.map((b) => (b.id === id ? { ...b, name } : b)) })),
      deleteBase: (id) => set((s) => ({ bases: s.bases.filter((b) => b.id !== id) })),
      addRule: (baseId, title, detail) =>
        set((s) => ({
          bases: s.bases.map((b) =>
            b.id === baseId
              ? {
                  ...b,
                  rules: [
                    ...b.rules,
                    { id: uid(), title, detail: detail ?? defaultDetail(title) },
                  ],
                }
              : b,
          ),
        })),
      updateRule: (baseId, ruleId, patch) =>
        set((s) => ({
          bases: s.bases.map((b) =>
            b.id === baseId
              ? {
                  ...b,
                  rules: b.rules.map((r) => (r.id === ruleId ? { ...r, ...patch } : r)),
                }
              : b,
          ),
        })),
      deleteRule: (baseId, ruleId) =>
        set((s) => ({
          bases: s.bases.map((b) =>
            b.id === baseId ? { ...b, rules: b.rules.filter((r) => r.id !== ruleId) } : b,
          ),
        })),
    }),
    { name: "ivy-memory-v1" },
  ),
);
