import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { taskExamples, homeNeedToKnow, homeSuggestions, mockUser } from "@/lib/mock-data";
import { EmptyState } from "@/components/workspace/Common";
import {
  Plus,
  UserRound,
  CalendarClock,
  ShieldCheck,
  Mic,
  ChevronDown,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/_app/home")({
  head: () => ({
    meta: [
      { title: "Home — EmailOS AI" },
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
            {greeting}, {mockUser.name}. You have 7 emails that need your attention.
          </h1>

          {/* Task input */}
          <div className="mt-8 rounded-3xl border border-border bg-card shadow-[var(--shadow-card)] p-5">
            <div className="min-h-[76px]">
              <p className="text-sm text-muted-foreground">Give EmailOS a task</p>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <IconButton icon={Plus} label="Add" />
              <IconButton icon={UserRound} label="People" />
              <IconButton icon={CalendarClock} label="Schedule" />
              <IconButton icon={ShieldCheck} label="Approval mode" />
              <div className="ml-auto flex items-center gap-1.5">
                <button className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-cream transition-colors">
                  Task <ChevronDown className="h-3 w-3" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background hover:opacity-90 transition-opacity">
                  <Mic className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Example prompts */}
          <div className="mt-4 flex flex-wrap gap-2">
            {taskExamples.map((t) => (
              <button
                key={t}
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
                <span className="text-xs text-muted-foreground">Today</span>
              </div>
              <EmptyState title="Nothing here yet" hint="Give EmailOS a task above and it'll show up here." />
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
                  <button className="w-full text-left rounded-xl px-3 py-2 text-sm text-foreground hover:bg-cream border border-transparent hover:border-border transition-colors">
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

function IconButton({
  icon: Icon,
  label,
}: {
  icon: typeof Plus;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-cream transition-colors"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
