import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sparkles, Check } from "lucide-react";
import { PageHeader } from "@/components/workspace/Common";
import { useEmailTodos, useMeetings } from "@/lib/api/queries";
import { useTodoStore } from "@/lib/todo-store";

export const Route = createFileRoute("/_app/todo")({
  head: () => ({
    meta: [
      { title: "To-do — Ivy" },
      {
        name: "description",
        content: "Personal action items your meeting assistant pulled out for you.",
      },
      { property: "og:title", content: "To-do — Ivy" },
      {
        property: "og:description",
        content: "Personal action items your meeting assistant pulled out for you.",
      },
    ],
  }),
  component: TodoPage,
});

interface DerivedTodo {
  id: string;
  meetingId: string;
  meetingTitle: string;
  task: string;
  due?: string;
}

type Filter = "all" | "open" | "done";

function TodoPage() {
  const navigate = useNavigate();
  const doneMap = useTodoStore((s) => s.doneMap);
  const toggle = useTodoStore((s) => s.toggle);

  const [filter, setFilter] = useState<Filter>("open");
  const [meetingId, setMeetingId] = useState<string | "all">("all");

  const { data: meetings = [] } = useMeetings();
  const { data: emailTodos = [] } = useEmailTodos();

  const myTodos = useMemo<DerivedTodo[]>(
    () => [
      ...meetings.flatMap((m) =>
        m.followUp.todos
          .filter((t) => t.owner.toLowerCase().includes("theo"))
          .map((t, i) => ({
            id: `${m.id}-${i}`,
            meetingId: m.id,
            meetingTitle: m.title,
            task: t.task,
            due: t.due,
          })),
      ),
      // Suggested actions from emails that still need a reply.
      ...emailTodos.map((t) => ({
        id: t.id,
        meetingId: "inbox",
        meetingTitle: t.context,
        task: t.text,
        due: t.deadline,
      })),
    ],
    [meetings, emailTodos],
  );

  const filtered = myTodos.filter((t) => {
    if (meetingId !== "all" && t.meetingId !== meetingId) return false;
    const isDone = !!doneMap[t.id];
    if (filter === "open") return !isDone;
    if (filter === "done") return isDone;
    return true;
  });

  const openCount = myTodos.filter((t) => !doneMap[t.id]).length;
  const doneCount = myTodos.length - openCount;

  const meetingChips = [
    { id: "all" as const, title: "All sources" },
    ...meetings.map((m) => ({ id: m.id, title: m.title })),
    ...(emailTodos.length ? [{ id: "inbox", title: "From emails" }] : []),
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 lg:px-10 py-10">
      <PageHeader
        title="Your to-do list"
        subtitle="Action items your meeting assistant pulled out for you."
      />

      <div className="mb-5 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
        <div className="flex items-start gap-3">
          <span className="h-7 w-7 rounded-lg bg-foreground text-background inline-flex items-center justify-center shrink-0">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <p className="text-xs text-foreground/85 leading-relaxed">
            These items were surfaced by Ivy from your meeting follow-ups.
            Complete them here or open the original meeting for context.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {(["open", "all", "done"] as const).map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                "rounded-full border px-3.5 py-1.5 text-xs transition-colors capitalize " +
                (active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:bg-cream")
              }
            >
              {f}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {meetingChips.map((c) => {
          const active = meetingId === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setMeetingId(c.id)}
              className={
                "rounded-full border px-3 py-1 text-xs transition-colors " +
                (active
                  ? "bg-cream border-foreground text-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-cream")
              }
            >
              {c.title}
            </button>
          );
        })}
      </div>

      <div className="grid gap-2">
        {filtered.map((t) => {
          const done = !!doneMap[t.id];
          return (
            <div
              key={t.id}
              className="group flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-[var(--shadow-soft)]"
            >
              <button
                onClick={() => toggle(t.id)}
                aria-label={done ? "Mark as open" : "Mark as done"}
                className={
                  "mt-0.5 h-4 w-4 shrink-0 rounded border inline-flex items-center justify-center transition-colors " +
                  (done
                    ? "bg-foreground border-foreground text-background"
                    : "border-border bg-background hover:border-foreground")
                }
              >
                {done && <Check className="h-3 w-3" />}
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className={
                    "text-sm " +
                    (done
                      ? "text-muted-foreground line-through"
                      : "text-foreground")
                  }
                >
                  {t.task}
                </p>
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  {t.due && (
                    <span className="inline-flex items-center rounded-full bg-cream border border-border/70 px-2 py-0.5 text-[10px] text-foreground">
                      Due · {t.due}
                    </span>
                  )}
                  <button
                    onClick={() => navigate({ to: t.meetingId === "inbox" ? "/inbox" : "/meetings" })}
                    className="text-[10px] text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                  >
                    From: {t.meetingTitle}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
            <p className="text-sm text-muted-foreground">
              {myTodos.length === 0
                ? "No action items yet. Ivy will add them here after your next meeting."
                : "Nothing matches this filter."}
            </p>
          </div>
        )}
      </div>

      {myTodos.length > 0 && (
        <p className="mt-6 text-xs text-muted-foreground text-center">
          {openCount} open · {doneCount} done
        </p>
      )}
    </div>
  );
}
