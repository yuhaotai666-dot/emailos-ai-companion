import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OnboardingState {
  timezone: string;
  theme: "system" | "light" | "dark";
  connections: Record<string, boolean>;
  assistantName: string;
  persona: string;
  personality: string;
  routines: Record<string, Record<string, boolean>>;
  setField: <K extends keyof OnboardingState>(k: K, v: OnboardingState[K]) => void;
  toggleConnection: (id: string) => void;
  toggleRoutineOption: (routineId: string, optionId: string) => void;
  finish: () => void;
  reset: () => void;
}

export const useOnboarding = create<OnboardingState>()(
  persist(
    (set) => ({
      timezone: "America/Los_Angeles",
      theme: "system",
      connections: { gmail: true },
      assistantName: "EmailOS",
      persona: "professional",
      personality: "Professional",
      routines: {
        "auto-inbox": {
          label: true,
          detect: true,
          draft: true,
          archive: false,
          schedule: true,
        },
        "morning-briefing": {
          priority: true,
          meetings: true,
          overdue: true,
          actions: true,
        },
        "meeting-briefing": {
          prep: true,
          summary: true,
          actions: true,
          followup: true,
        },
        "follow-up-watcher": {
          detect: true,
          remind: true,
          suggest: true,
        },
      },
      setField: (k, v) => set({ [k]: v } as Partial<OnboardingState>),
      toggleConnection: (id) =>
        set((s) => ({ connections: { ...s.connections, [id]: !s.connections[id] } })),
      toggleRoutineOption: (routineId, optionId) =>
        set((s) => ({
          routines: {
            ...s.routines,
            [routineId]: {
              ...s.routines[routineId],
              [optionId]: !s.routines[routineId]?.[optionId],
            },
          },
        })),
      finish: () => {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("emailos_onboarded", "true");
        }
      },
      reset: () => {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("emailos_onboarded");
        }
      },
    }),
    { name: "emailos-onboarding" },
  ),
);
