import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TodoState {
  doneMap: Record<string, boolean>;
  toggle: (id: string) => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      doneMap: {},
      toggle: (id) =>
        set((s) => ({ doneMap: { ...s.doneMap, [id]: !s.doneMap[id] } })),
    }),
    { name: "emailos-todos-v1" },
  ),
);
