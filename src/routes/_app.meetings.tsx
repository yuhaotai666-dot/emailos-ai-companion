import { createFileRoute } from "@tanstack/react-router";
import { mockMeetings } from "@/lib/mock-data";
import { PageHeader } from "@/components/workspace/Common";
import { CalendarClock, Users } from "lucide-react";

export const Route = createFileRoute("/_app/meetings")({
  head: () => ({
    meta: [
      { title: "Meetings — EmailOS AI" },
      { name: "description", content: "Prep, notes, summaries, and follow-ups from your calendar." },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-10 py-10">
      <PageHeader
        title="Meetings"
        subtitle="Prep, notes, summaries, and follow-ups from your calendar."
      />

      <h2 className="text-sm font-medium text-foreground mb-3">Upcoming meetings</h2>
      <div className="grid gap-3">
        {mockMeetings.map((m) => (
          <article
            key={m.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl text-foreground">{m.title}</h3>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <CalendarClock className="h-3 w-3" /> {m.time}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" /> {m.attendees.join(", ")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid md:grid-cols-3 gap-3">
              <div className="rounded-xl bg-cream/60 border border-border/60 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Prep notes</p>
                <p className="text-xs text-foreground mt-1">{m.prep}</p>
              </div>
              <div className="rounded-xl bg-cream/60 border border-border/60 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Suggested questions</p>
                <ul className="mt-1 grid gap-1">
                  {m.questions.map((q) => (
                    <li key={q} className="text-xs text-foreground">
                      · {q}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-cream/60 border border-border/60 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Action items</p>
                <ul className="mt-1 grid gap-1">
                  {m.actionItems.map((a) => (
                    <li key={a} className="text-xs text-foreground">
                      · {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
