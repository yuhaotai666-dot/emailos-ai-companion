import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AgentRule {
  id: string;
  text: string;
}

interface RulesState {
  rules: AgentRule[];
  addRule: (text?: string) => void;
  updateRule: (id: string, text: string) => void;
  deleteRule: (id: string) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

const seed: AgentRule[] = [
  { id: uid(), text: "Never send emails without my explicit approval." },
  { id: uid(), text: "Always keep replies concise and action-oriented." },
  { id: uid(), text: "Flag any email that mentions payments or contracts." },
];

export const useRulesStore = create<RulesState>()(
  persist(
    (set) => ({
      rules: seed,
      addRule: (text) =>
        set((s) => ({
          rules: [...s.rules, { id: uid(), text: text ?? "" }],
        })),
      updateRule: (id, text) =>
        set((s) => ({
          rules: s.rules.map((r) => (r.id === id ? { ...r, text } : r)),
        })),
      deleteRule: (id) =>
        set((s) => ({ rules: s.rules.filter((r) => r.id !== id) })),
    }),
    { name: "ivy-agent-rules-v1" },
  ),
);
