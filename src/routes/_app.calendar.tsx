import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/workspace/Common";
import { Button } from "@/components/ui/button";
import { mockMeetings } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Ivy" },
      { name: "description", content: "Your meetings and email-driven events in one calm view." },
      { property: "og:title", content: "Calendar — Ivy" },
      { property: "og:description", content: "Your meetings and email-driven events in one calm view." },
    ],
  }),
  component: CalendarPage,
});

type Source = "meeting" | "email" | "reminder";
interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
  source: Source;
  meetingId?: string;
}

const SOURCE_STYLES: Record<Source, string> = {
  meeting: "bg-blue-100 text-blue-900 border-blue-200",
  email: "bg-amber-100 text-amber-900 border-amber-200",
  reminder: "bg-slate-100 text-slate-800 border-slate-200",
};

const SOURCE_LABEL: Record<Source, string> = {
  meeting: "Meeting",
  email: "Email",
  reminder: "Reminder",
};

function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}
function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

const MEETING_OFFSETS = [0, 1, 3]; // aligns m1..m3 to today, tomorrow, Thu-ish
const MEETING_TIMES = ["2:00 PM", "11:30 AM", "4:00 PM"];

function useEvents(): CalendarEvent[] {
  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events: CalendarEvent[] = mockMeetings.map((m, i) => ({
      id: m.id,
      title: m.title,
      date: addDays(today, MEETING_OFFSETS[i] ?? i),
      time: MEETING_TIMES[i] ?? "10:00 AM",
      source: "meeting",
      meetingId: m.id,
    }));

    const extras: Omit<CalendarEvent, "id">[] = [
      { title: "Payment run — creators", date: addDays(today, 2), time: "9:00 AM", source: "reminder" },
      { title: "Publish window — Maya video", date: addDays(today, 3), time: "8:00 AM", source: "email" },
      { title: "Krishna payment ETA reply due", date: addDays(today, 1), time: "12:00 PM", source: "email" },
      { title: "PJ tracking link deadline", date: addDays(today, 4), source: "reminder" },
      { title: "Northlight follow-up", date: addDays(today, 7), time: "10:00 AM", source: "email" },
    ];

    extras.forEach((e, i) => events.push({ ...e, id: `x${i}` }));
    return events;
  }, []);
}

function CalendarPage() {
  const navigate = useNavigate();
  const events = useEvents();
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [cursor, setCursor] = useState(() => startOfMonth(today));

  const monthLabel = cursor.toLocaleString("en-US", { month: "long", year: "numeric" });
  const firstWeekday = cursor.getDay(); // 0 = Sun
  const gridStart = addDays(cursor, -firstWeekday);
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const key = e.date.toDateString();
      const arr = map.get(key) ?? [];
      arr.push(e);
      map.set(key, arr);
    }
    return map;
  }, [events]);

  const upcoming = useMemo(() => {
    const in7 = addDays(today, 7);
    return events
      .filter((e) => e.date >= today && e.date <= in7)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  }, [events, today]);

  const handleEventClick = (e: CalendarEvent) => {
    if (e.source === "meeting") navigate({ to: "/meetings" });
    else toast(e.title);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-10 py-10">
      <PageHeader
        title="Calendar"
        subtitle="Your meetings and email-driven events in one calm view."
      />

      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="inline-flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-background"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-serif text-xl text-foreground min-w-[160px]">{monthLabel}</h2>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-background"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full h-8 text-xs"
            onClick={() => setCursor(startOfMonth(today))}
          >
            Today
          </Button>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background p-1">
          <button className="rounded-full bg-foreground text-background px-3 py-1 text-xs">
            Month
          </button>
          <button
            onClick={() => toast("Week view — coming soon")}
            className="rounded-full px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Week
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-[10px] uppercase tracking-wide text-muted-foreground text-center py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => {
            const inMonth = d.getMonth() === cursor.getMonth();
            const isToday = sameDay(d, today);
            const dayEvents = eventsByDay.get(d.toDateString()) ?? [];
            const shown = dayEvents.slice(0, 2);
            const more = dayEvents.length - shown.length;

            return (
              <div
                key={d.toISOString()}
                className={
                  "min-h-[90px] rounded-lg border border-border/60 p-1.5 flex flex-col gap-1 " +
                  (inMonth ? "bg-card" : "bg-cream/30")
                }
              >
                <div className="flex items-center justify-between">
                  <span
                    className={
                      "text-[11px] inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full " +
                      (isToday
                        ? "bg-foreground text-background"
                        : inMonth
                          ? "text-foreground"
                          : "text-muted-foreground")
                    }
                  >
                    {d.getDate()}
                  </span>
                </div>
                <div className="grid gap-0.5">
                  {shown.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => handleEventClick(e)}
                      className={
                        "text-left text-[10px] truncate rounded border px-1.5 py-0.5 " +
                        SOURCE_STYLES[e.source]
                      }
                      title={e.title}
                    >
                      {e.time ? <span className="opacity-70 mr-1">{e.time}</span> : null}
                      {e.title}
                    </button>
                  ))}
                  {more > 0 && (
                    <span className="text-[10px] text-muted-foreground px-1">+{more} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-medium text-foreground mb-3">Upcoming this week</h2>
        <div className="grid gap-2">
          {upcoming.map((e) => (
            <button
              key={e.id}
              onClick={() => handleEventClick(e)}
              className="w-full text-left rounded-xl border border-border bg-card px-4 py-3 shadow-[var(--shadow-soft)] hover:bg-cream/50 transition-colors flex items-center gap-3"
            >
              <div className="text-center w-14 shrink-0">
                <p className="text-[10px] uppercase text-muted-foreground">
                  {e.date.toLocaleString("en-US", { weekday: "short" })}
                </p>
                <p className="font-serif text-lg text-foreground leading-none">{e.date.getDate()}</p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{e.title}</p>
                <p className="text-xs text-muted-foreground">{e.time ?? "All day"}</p>
              </div>
              <span
                className={
                  "text-[10px] rounded-full border px-2 py-0.5 shrink-0 " + SOURCE_STYLES[e.source]
                }
              >
                {SOURCE_LABEL[e.source]}
              </span>
            </button>
          ))}
          {upcoming.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted-foreground">
              Nothing scheduled this week.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
