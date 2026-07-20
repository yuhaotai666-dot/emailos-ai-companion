import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RulesState {
  text: string;
  setText: (text: string) => void;
}

const seed = `Never send emails without my explicit approval.
Always keep replies concise and action-oriented.
Flag any email that mentions payments or contracts.`;

export const useRulesStore = create<RulesState>()(
  persist(
    (set) => ({
      text: seed,
      setText: (text) => set({ text }),
    }),
    { name: "ivy-agent-rules-v2" },
  ),
);
