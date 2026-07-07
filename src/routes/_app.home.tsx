import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  taskExamples,
  homeNeedToKnow,
  homeSuggestions,
  mockUser,
  mockMeetings,
} from "@/lib/mock-data";
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
  GripHorizontal,
} from "lucide-react";

export const Route = createFileRoute("/_app/home")({
  head: () => ({
    meta: [
      { title: "Home — Ivy" },
      { name: "description", content: "Your daily briefing, tasks, and what needs your attention." },
    ],
  }),
  component: HomePage,
});

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const MIN_CHAT_HEIGHT = 320;
const MAX_CHAT_HEIGHT = 800;
const COLLAPSED_HEIGHT = 420;
const EXPANDED_HEIGHT = 640;

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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: `Hi ${mockUser.name.split(" ")[0]} — ask me anything, or tell me a task to schedule. Try "Notify me every day at 8:30am how many meetings I have."`,
    },
  ]);
  const [chatHeight, setChatHeight] = useState(COLLAPSED_HEIGHT);
  const hasExpandedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const todayMeetings = useMemo(
    () => mockMeetings.filter((m) => /^today/i.test(m.time)),
    [],
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (messages.length > 1 && !hasExpandedRef.current) {
      hasExpandedRef.current = true;
      setChatHeight(EXPANDED_HEIGHT);
    }
  }, [messages]);

  function submit() {
    const value = input.trim();
    if (!value) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text: value };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    const sched = detectSchedule(value);
    let replyText: string;
    if (sched) {
      const t = addTask({ prompt: value, schedule: sched.schedule, time: sched.time });
      replyText = `Scheduled — ${describeSchedule(t)}. I'll run this automatically and you can manage it below.`;
      toast.success("Scheduled task created", { description: describeSchedule(t) });
    } else if (/meeting/i.test(value)) {
      const count = todayMeetings.length;
      const times = todayMeetings.map((m) => m.time.replace(/^Today\s*·\s*/i, "")).join(", ");
      replyText = count
        ? `You have ${count} meeting${count === 1 ? "" : "s"} today${times ? ` — ${times}` : ""}.`
        : "You have no meetings today.";
    } else {
      replyText = "Got it — I'll work on this and update you here. Add words like \"every day\" or \"at 9am\" to schedule it.";
    }

    setTimeout(() => {
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", text: replyText }]);
    }, 350);
  }

  function startResize(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = chatHeight;
    function onMouseMove(moveEvent: MouseEvent) {
      const delta = moveEvent.clientY - startY;
      const newHeight = Math.max(
        MIN_CHAT_HEIGHT,
        Math.min(MAX_CHAT_HEIGHT, startHeight + delta),
      );
      setChatHeight(newHeight);
    }
    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10">
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        {/* Main column */}
        <div>
          <div className="text-xs text-muted-foreground">
            <span>{today}</span>
          </div>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl text-foreground leading-tight">
            {greeting}, {mockUser.name}.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Chat with Ivy — ask questions, schedule tasks, or get a briefing.
          </p>

          {/* Chat window */}
          <div
            className="mt-6 rounded-3xl border border-border bg-card shadow-[var(--shadow-card)] flex flex-col overflow-hidden"
            style={{ height: chatHeight }}
          >
            {/* Conversation */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} userName={mockUser.name} />
              ))}
            </div>

            {/* Composer */}
            <div className="border-t border-border bg-card/60 px-5 pt-4 pb-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                placeholder="Message Ivy…"
                className="min-h-[64px] border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none p-0 text-sm bg-transparent"
              />
              <div className="mt-2 flex items-center gap-1.5">
                <IconButton icon={Plus} label="Add" />
                <IconButton icon={UserRound} label="People" />
                <IconButton
                  icon={CalendarClock}
                  label="Schedule"
                  onClick={() => setInput((v) => v || "Notify me every day at 8:30am how many meetings I have today and the times.")}
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

            {/* Resize handle */}
            <div
              onMouseDown={startResize}
              className="h-4 w-full cursor-ns-resize flex items-center justify-center bg-card/60 hover:bg-border/40 transition-colors"
              title="Drag to resize"
            >
              <GripHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

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

          {/* Tasks */}
          <div className="mt-10">
            <section>
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="text-sm font-medium text-foreground">Tasks</h2>
                <span className="text-xs text-muted-foreground">
                  {tasks.filter((t) => t.enabled).length} active
                </span>
              </div>
              {tasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-cream/40 px-6 py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No scheduled tasks yet. Ask Ivy above to schedule something.
                  </p>
                </div>
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
              {homeNeedToKnow.map((n) => (
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
              {homeSuggestions.map((s) => (
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

function MessageBubble({ message, userName }: { message: ChatMessage; userName: string }) {
  const isUser = message.role === "user";
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm leading-relaxed shadow-[var(--shadow-soft)]">
          {message.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream border border-border">
        <Sparkles className="h-3.5 w-3.5 text-accent" />
      </span>
      <div className="max-w-[80%]">
        <p className="text-[11px] text-muted-foreground mb-1">Ivy</p>
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <span className="sr-only">to {userName}</span>
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
