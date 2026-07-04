import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Schedule = "daily" | "weekdays" | "weekly" | "once";

export interface ScheduledTask {
  id: string;
  prompt: string;
  schedule: Schedule;
  time: string; // e.g. "09:00"
  enabled: boolean;
  createdAt: number;
  lastRunAt?: number;
}

interface State {
  tasks: ScheduledTask[];
  addTask: (t: Omit<ScheduledTask, "id" | "createdAt" | "enabled"> & { enabled?: boolean }) => ScheduledTask;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  markRun: (id: string) => void;
}

function scheduleLabel(s: Schedule) {
  switch (s) {
    case "daily":
      return "Every day";
    case "weekdays":
      return "Weekdays";
    case "weekly":
      return "Weekly";
    case "once":
      return "One-time";
  }
}

export function describeSchedule(t: ScheduledTask) {
  return `${scheduleLabel(t.schedule)} · ${t.time}`;
}

/** Infer a schedule from free-form user prompt. Returns null if not scheduled. */
export function detectSchedule(input: string): { schedule: Schedule; time: string } | null {
  const s = input.toLowerCase();
  const scheduled =
    /(每天|每日|daily|every day|each day)/.test(s) ||
    /(工作日|weekday|weekdays)/.test(s) ||
    /(每周|weekly|every week)/.test(s) ||
    /(通知我|remind me|notify me).*(每|daily|every|each)/.test(s);
  if (!scheduled) return null;

  let schedule: Schedule = "daily";
  if (/(工作日|weekday)/.test(s)) schedule = "weekdays";
  else if (/(每周|weekly|every week)/.test(s)) schedule = "weekly";

  // time detection: 8am, 08:00, 9:30, 上午9点, 早上8点
  let time = "09:00";
  const m24 = s.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
  const m12 = s.match(/\b(\d{1,2})\s*(am|pm)\b/);
  const mCn = s.match(/(早上|上午|下午|晚上)?\s*(\d{1,2})\s*(点|时)/);
  if (m24) {
    time = `${m24[1].padStart(2, "0")}:${m24[2]}`;
  } else if (m12) {
    let h = parseInt(m12[1], 10);
    if (m12[2] === "pm" && h < 12) h += 12;
    if (m12[2] === "am" && h === 12) h = 0;
    time = `${String(h).padStart(2, "0")}:00`;
  } else if (mCn) {
    let h = parseInt(mCn[2], 10);
    const period = mCn[1];
    if ((period === "下午" || period === "晚上") && h < 12) h += 12;
    time = `${String(h).padStart(2, "0")}:00`;
  }
  return { schedule, time };
}

export const useScheduledTasksStore = create<State>()(
  persist(
    (set) => ({
      tasks: [
        {
          id: "st-seed-meetings",
          prompt: "Notify me every day how many meetings I have today and at what times.",
          schedule: "daily",
          time: "08:30",
          enabled: true,
          createdAt: Date.now(),
        },
      ],
      addTask: (t) => {
        const task: ScheduledTask = {
          id: `st-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          createdAt: Date.now(),
          enabled: t.enabled ?? true,
          prompt: t.prompt,
          schedule: t.schedule,
          time: t.time,
        };
        set((s) => ({ tasks: [task, ...s.tasks] }));
        return task;
      },
      toggle: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)),
        })),
      remove: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      markRun: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, lastRunAt: Date.now() } : t)),
        })),
    }),
    { name: "ivy-scheduled-tasks-v1" },
  ),
);
