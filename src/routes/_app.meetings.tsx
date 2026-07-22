import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useMeetings } from "@/lib/api/queries";
import { PageHeader } from "@/components/workspace/Common";
import { Button } from "@/components/ui/button";
import { CalendarClock, Users, Sparkles, Check, Pencil, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_app/meetings")({
  head: () => ({
    meta: [
      { title: "Meetings — Ivy" },
      {
        name: "description",
        content:
          "Meeting prep, notes, and AI-generated follow-up emails ready to send to attendees.",
      },
      { property: "og:title", content: "Meetings — Ivy" },
      {
        property: "og:description",
        content:
          "Meeting prep, notes, and AI-generated follow-up emails ready to send to attendees.",
      },
      { property: "og:url", content: "https://personal-postman-ai.lovable.app/meetings" },
    ],
    links: [{ rel: "canonical", href: "https://personal-postman-ai.lovable.app/meetings" }],
  }),
  component: MeetingsPage,
});

type SendState = Record<string, "draft" | "sent">;

function MeetingsPage() {
  const [sent, setSent] = useState<SendState>({});
  const { data: meetings = [] } = useMeetings();

  const send = (id: string, count: number) => {
    setSent((s) => ({ ...s, [id]: "sent" }));
    toast.success(`Follow-up sent to ${count} attendee${count === 1 ? "" : "s"}`);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-10 py-10">
      <PageHeader
        title="Meetings"
        subtitle="Prep, notes, and AI follow-up emails ready to send to attendees."
      />

      <h2 className="text-sm font-medium text-foreground mb-3">Upcoming meetings</h2>
      <div className="grid gap-4">
        {meetings.map((m) => {
          const status = sent[m.id] ?? "draft";
          const isSent = status === "sent";
          return (
            <article
              key={m.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl text-foreground">{m.title}</h3>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
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
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Suggested questions
                  </p>
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

              {/* AI Follow-up email */}
              <div className="mt-5 rounded-xl border border-border bg-background/60 p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="inline-flex items-center gap-2">
                    <span className="h-6 w-6 rounded-md bg-foreground text-background inline-flex items-center justify-center">
                      <Sparkles className="h-3 w-3" />
                    </span>
                    <p className="text-sm font-medium text-foreground">AI follow-up email</p>
                    <span
                      className={
                        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] " +
                        (isSent
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border-amber-200 bg-amber-50 text-amber-900")
                      }
                    >
                      {isSent ? <Check className="h-2.5 w-2.5" /> : null}
                      {isSent ? "Sent" : "Draft"}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Generated {m.followUp.generatedAt}
                  </p>
                </div>

                <div className="mt-3 grid gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-muted-foreground">To:</span>
                    {m.followUp.recipients.map((r) => (
                      <span
                        key={r}
                        className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-foreground"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Subject: </span>
                    <span className="font-medium text-foreground">{m.followUp.subject}</span>
                  </div>
                </div>

                <div className="mt-3 rounded-lg bg-cream/60 border border-border/60 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Meeting summary
                  </p>
                  <p className="text-xs text-foreground mt-1 leading-relaxed">
                    {m.followUp.summary}
                  </p>
                </div>

                <div className="mt-3 rounded-lg bg-cream/60 border border-border/60 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    To-do list
                  </p>
                  <ul className="mt-1.5 grid gap-1.5">
                    {m.followUp.todos.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="mt-[3px] h-3 w-3 rounded border border-border bg-background shrink-0" />
                        <span className="inline-flex items-center rounded-full bg-background border border-border px-1.5 py-0.5 text-[10px] text-foreground shrink-0">
                          {t.owner}
                        </span>
                        <span className="text-foreground">{t.task}</span>
                        {t.due && (
                          <span className="ml-auto text-[10px] text-muted-foreground shrink-0">
                            {t.due}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {isSent ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      Sent to {m.followUp.recipients.length} attendee
                      {m.followUp.recipients.length === 1 ? "" : "s"}
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => send(m.id, m.followUp.recipients.length)}
                      className="rounded-full h-8 text-xs bg-foreground text-background hover:opacity-90"
                    >
                      Send to all attendees
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full h-8 text-xs bg-background gap-1.5"
                    onClick={() => toast("Edit follow-up (mock)")}
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full h-8 text-xs gap-1.5"
                    onClick={() => toast("Regenerating follow-up…")}
                  >
                    <RefreshCw className="h-3 w-3" /> Regenerate
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
