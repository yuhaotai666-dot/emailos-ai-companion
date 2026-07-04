import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { taskExamples } from "@/lib/mock-data";
import { useBrief, useIvyChat, useMeetings, useUserName, type ChatEvent } from "@/lib/api/queries";
import { EmptyState } from "@/components/workspace/Common";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  useScheduledTasksStore,
  detectSchedule,
  describeSchedule,
  type ScheduledTask,
} from "@/lib/scheduled-tasks-store";
import {
  Plus,
  UserRound,
  CalendarClock,
  ShieldCheck,
  Mic,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Repeat,
  Trash2,
  ArrowUp,
} from "lucide-react";

interface ChatTurn {
  role: "user" | "ivy";
  text: string;
  events?: ChatEvent[];
}

export const Route = createFileRoute("/_app/home")({
  head: () => ({
    meta: [
      { title: "Home — Ivy" },
      { name: "description", content: "Your daily briefing, tasks, and what needs your attention." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const tasks = useScheduledTasksStore((s) => s.tasks);
  const addTask = useScheduledTasksStore((s) => s.addTask);
  const toggleTask = useScheduledTasksStore((s) => s.toggle);
  const removeTask = useScheduledTasksStore((s) => s.remove);

  const [input, setInput] = useState("");

  const { data: userName = "there" } = useUserName();
  const { data: brief } = useBrief();
  const { data: meetings = [] } = useMeetings();
  const ivy = useIvyChat();

  const [thread, setThread] = useState<ChatTurn[]>([]);

  const todayMeetings = useMemo(
    () => meetings.filter((m) => /^today/i.test(m.time)),
    [meetings],
  );

  function submit() {
    const value = input.trim();
    if (!value) return;
    const sched = detectSchedule(value);
    if (sched) {
      const t = addTask({ prompt: value, schedule: sched.schedule, time: sched.time });
      toast.success("Scheduled task created", {
        description: `${describeSchedule(t)} — Ivy will run this automatically.`,
      });
      setInput("");
      return;
    }
    // Everything else goes to Ivy — she plans, delegates to specialists, reviews.
    setThread((t) => [...t, { role: "user", text: value }]);
    ivy.mutate(value, {
      onSuccess: (r) =>
        setThread((t) => [...t, { role: "ivy", text: r.reply, events: r.events }]),
      onError: () =>
        setThread((t) => [
          ...t,
          { role: "ivy", text: "后端未启动 — 启动 backend 后我就能真正干活了。", events: [] },
        ]),
    });
    setInput("");
  }

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-10 py-10">
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        {/* Main column */}
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{today}</span>
            <Link to="/meetings" className="hover:text-foreground transition-colors">
              View schedule →
            </Link>
          </div>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl text-foreground leading-tight">
            {greeting}, {userName}.{" "}
            {brief
              ? `You have ${brief.needsAttention} email${brief.needsAttention === 1 ? "" : "s"} that need your attention.`
              : "Loading your briefing…"}
          </h1>

          {/* Task input */}
          <div className="mt-8 rounded-3xl border border-border bg-card shadow-[var(--shadow-card)] p-5">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Give Ivy a task — try 'Notify me every day at 8:30am how many meetings I have.'"
              className="min-h-[76px] border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none p-0 text-sm bg-transparent"
            />
            <div className="mt-2 flex items-center gap-1.5">
              <IconButton icon={Plus} label="Add" />
              <IconButton icon={UserRound} label="People" />
              <IconButton
                icon={CalendarClock}
                label="Schedule"
                onClick={() => setInput((v) => (v ? v : "Notify me every day at 8:30am how many meetings I have today and the times."))}
              />
              <IconButton icon={ShieldCheck} label="Approval mode" />
              <div className="ml-auto flex items-center gap-1.5">
                <button className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-cream transition-colors">
                  Task <ChevronDown className="h-3 w-3" />
                </button>
                <button
                  onClick={submit}
                  aria-label="Send task"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background hover:opacity-90 transition-opacity"
                >
                  {input.trim() ? <ArrowUp className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Conversation with Ivy */}
          {(thread.length > 0 || ivy.isPending) && (
            <div className="mt-4 grid gap-2">
              {thread.map((turn, i) => (
                <div
                  key={i}
                  className={
                    "rounded-2xl border px-4 py-3 text-sm leading-relaxed " +
                    (turn.role === "user"
                      ? "border-border bg-cream/60 text-foreground ml-10"
                      : "border-border bg-card text-foreground mr-6 shadow-[var(--shadow-soft)]")
                  }
                >
                  {turn.role === "ivy" && (
                    <div className="mb-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Sparkles className="h-3 w-3 text-accent" /> Ivy
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{turn.text}</p>
                  {turn.events && turn.events.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {turn.events.map((e, j) => (
                        <span
                          key={j}
                          className="inline-flex items-center rounded-full border border-border bg-cream/70 px-2 py-0.5 text-[10px] text-muted-foreground"
                        >
                          {e.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {ivy.isPending && (
                <div className="rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground mr-6">
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-accent animate-pulse" />
                    Ivy 正在规划 / 派活 / 审核…
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Example prompts */}
          <div className="mt-4 flex flex-wrap gap-2">
            {taskExamples.map((t) => (
              <button
                key={t}
                onClick={() => setInput(t)}
                className="rounded-full border border-border bg-cream/60 px-3 py-1.5 text-xs text-foreground hover:bg-cream transition-colors"
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tasks & Recents */}
          <div className="mt-10 grid gap-8">
            <section>
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="text-sm font-medium text-foreground">Tasks</h2>
                <span className="text-xs text-muted-foreground">
                  {tasks.filter((t) => t.enabled).length} active
                </span>
              </div>
              {tasks.length === 0 ? (
                <EmptyState title="Nothing here yet" hint="Give Ivy a task above and it'll show up here." />
              ) : (
                <ul className="grid gap-2">
                  {tasks.map((t) => (
                    <TaskRow
                      key={t.id}
                      task={t}
                      onToggle={() => toggleTask(t.id)}
                      onRemove={() => removeTask(t.id)}
                      meetingCount={todayMeetings.length}
                      meetingTimes={todayMeetings.map((m) => m.time.replace(/^Today\s*·\s*/i, ""))}
                    />
                  ))}
                </ul>
              )}
            </section>

            <section>
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="text-sm font-medium text-foreground">Recents</h2>
                <Link to="/inbox" className="text-xs text-muted-foreground hover:text-foreground">
                  See all
                </Link>
              </div>
              <EmptyState title="No recent activity" hint="Your recent tasks and drafts will appear here." />
            </section>
          </div>
        </div>

        {/* Right panel */}
        <aside className="grid gap-4 self-start">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <h3 className="text-sm font-medium text-foreground">Need to know</h3>
            </div>
            <ul className="grid gap-3">
              {(brief?.needToKnow ?? []).map((n) => (
                <li key={n.id} className="border-b border-border last:border-0 pb-3 last:pb-0">
                  <p className="text-sm text-foreground leading-snug">{n.text}</p>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{n.time}</span>
                    <Link to="/inbox" className="hover:text-foreground inline-flex items-center gap-1">
                      Read here <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <h3 className="text-sm font-medium text-foreground mb-3">Suggestions</h3>
            <ul className="grid gap-2">
              {(brief?.suggestions ?? []).map((s) => (
                <li key={s}>
                  <button
                    onClick={() => setInput(s)}
                    className="w-full text-left rounded-xl px-3 py-2 text-sm text-foreground hover:bg-cream border border-transparent hover:border-border transition-colors"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function TaskRow({
  task,
  onToggle,
  onRemove,
  meetingCount,
  meetingTimes,
}: {
  task: ScheduledTask;
  onToggle: () => void;
  onRemove: () => void;
  meetingCount: number;
  meetingTimes: string[];
}) {
  // Detect the meeting-briefing task by keywords to show a live preview
  const isMeetingBrief = /meeting/i.test(task.prompt);
  return (
    <li className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-cream border border-border shrink-0">
          <Repeat className="h-3.5 w-3.5 text-foreground" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-foreground leading-snug">{task.prompt}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5">
              <CalendarClock className="h-3 w-3" />
              {describeSchedule(task)}
            </span>
            <span
              className={
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 " +
                (task.enabled
                  ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                  : "bg-slate-100 text-slate-700 border border-slate-200")
              }
            >
              {task.enabled ? "On" : "Off"}
            </span>
          </div>

          {isMeetingBrief && task.enabled && (
            <div className="mt-3 rounded-xl bg-cream/60 border border-border/60 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Today's briefing preview
              </p>
              <p className="text-xs text-foreground mt-0.5">
                {meetingCount === 0
                  ? "No meetings today."
                  : `${meetingCount} meeting${meetingCount === 1 ? "" : "s"} today${
                      meetingTimes.length ? ` — ${meetingTimes.join(", ")}` : ""
                    }.`}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Switch checked={task.enabled} onCheckedChange={onToggle} aria-label="Toggle task" />
          <button
            onClick={onRemove}
            aria-label="Delete task"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-cream transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </li>
  );
}

function IconButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Plus;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-cream transition-colors"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
