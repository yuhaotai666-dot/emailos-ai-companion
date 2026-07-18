import { create } from "zustand";
import { persist } from "zustand/middleware";

import { markOnboarded } from "@/lib/onboarding-status";

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
      assistantName: "Ivy",
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
        // Persists completion to the account profile on the backend
        // (localStorage is just a per-browser cache) — fire-and-forget so
        // navigation isn't blocked on the network.
        void markOnboarded();
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
