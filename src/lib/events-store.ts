import { create } from "zustand";
import { persist } from "zustand/middleware";

export type EventColor = "amber" | "blue" | "rose" | "green" | "violet" | "slate";

export const EVENT_COLORS: EventColor[] = ["amber", "blue", "rose", "green", "violet", "slate"];

export interface EventItem {
  id: string;
  name: string;
  color: EventColor;
}

interface EventsState {
  events: EventItem[];
  emailEventMap: Record<string, string | undefined>;
  addEvent: (name: string, color?: EventColor) => EventItem;
  renameEvent: (id: string, name: string) => void;
  recolorEvent: (id: string, color: EventColor) => void;
  deleteEvent: (id: string) => void;
  setEmailEvent: (emailId: string, eventId: string | null) => void;
}

const seed: EventItem[] = [
  { id: "evt-krishna", name: "Krishna Partnership", color: "amber" },
  { id: "evt-payouts", name: "Q4 Payout Batch", color: "green" },
  { id: "evt-maya", name: "Maya YouTube Segment", color: "blue" },
  { id: "evt-access", name: "Access Issues", color: "rose" },
  { id: "evt-northlight", name: "Northlight Intro", color: "violet" },
];

const seedMap: Record<string, string> = {
  e1: "evt-krishna",
  e2: "evt-maya",
  e3: "evt-krishna",
  e7: "evt-access",
  e8: "evt-payouts",
  e9: "evt-northlight",
};

export const useEventsStore = create<EventsState>()(
  persist(
    (set) => ({
      events: seed,
      emailEventMap: seedMap,
      addEvent: (name, color = "slate") => {
        const ev: EventItem = {
          id: `evt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          name: name.trim(),
          color,
        };
        set((s) => ({ events: [...s.events, ev] }));
        return ev;
      },
      renameEvent: (id, name) =>
        set((s) => ({
          events: s.events.map((e) => (e.id === id ? { ...e, name: name.trim() } : e)),
        })),
      recolorEvent: (id, color) =>
        set((s) => ({
          events: s.events.map((e) => (e.id === id ? { ...e, color } : e)),
        })),
      deleteEvent: (id) =>
        set((s) => {
          const map = { ...s.emailEventMap };
          for (const k of Object.keys(map)) if (map[k] === id) delete map[k];
          return { events: s.events.filter((e) => e.id !== id), emailEventMap: map };
        }),
      setEmailEvent: (emailId, eventId) =>
        set((s) => {
          const map = { ...s.emailEventMap };
          if (!eventId) delete map[emailId];
          else map[emailId] = eventId;
          return { emailEventMap: map };
        }),
    }),
    { name: "emailos-events-v1" },
  ),
);

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
  return COLOR_CLASSES[color];
}
