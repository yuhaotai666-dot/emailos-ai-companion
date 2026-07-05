import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FinishedKind = "sent" | "done";

interface FinishedState {
  finished: Record<string, FinishedKind>;
  markSent: (id: string) => void;
  markDone: (id: string) => void;
  unmarkDone: (id: string) => void;
  remove: (id: string) => void;
}

export const useFinishedEmailsStore = create<FinishedState>()(
  persist(
    (set) => ({
      finished: {},
      markSent: (id) => set((s) => ({ finished: { ...s.finished, [id]: "sent" } })),
      markDone: (id) => set((s) => ({ finished: { ...s.finished, [id]: "done" } })),
      unmarkDone: (id) =>
        set((s) => {
          if (s.finished[id] !== "done") return s;
          const next = { ...s.finished };
          delete next[id];
          return { finished: next };
        }),
      remove: (id) =>
        set((s) => {
          const next = { ...s.finished };
          delete next[id];
          return { finished: next };
        }),
    }),
    { name: "emailos-finished-emails-v1" },
  ),
);
