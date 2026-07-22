import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  useHealth,
  useRoutines,
  useRunRoutineNow,
  useSpecialists,
  useToggleRoutine,
} from "@/lib/api/queries";
import { Switch } from "@/components/ui/switch";
import {
  Inbox,
  CalendarClock,
  Sun,
  Search,
  Sparkles,
  Mail,
  Users,
  TrendingUp,
  Upload,
  Plus,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/_app/powers")({
  head: () => ({
    meta: [
      { title: "Powers — Ivy" },
      {
        name: "description",
        content:
          "Routines, skills, and integrations that let Ivy take work off your plate.",
      },
      { property: "og:title", content: "Powers — Ivy" },
      {
        property: "og:description",
        content:
          "Routines, skills, and integrations that let Ivy take work off your plate.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://personal-postman-ai.lovable.app/powers" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://personal-postman-ai.lovable.app/powers" }],
  }),
  component: PowersPage,
});

type Tab = "routines" | "skills" | "integrations" | "explore";

function PowersPage() {
  const [tab, setTab] = useState<Tab>("routines");

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-10 py-10">
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-[var(--shadow-soft)]">
          <TabButton active={tab === "routines"} onClick={() => setTab("routines")}>
            Routines
          </TabButton>
          <TabButton active={tab === "skills"} onClick={() => setTab("skills")}>
            Skills
          </TabButton>
          <TabButton
            active={tab === "integrations"}
            onClick={() => setTab("integrations")}
          >
            Integrations
          </TabButton>
          <TabButton active={tab === "explore"} onClick={() => setTab("explore")}>
            Explore
          </TabButton>
        </div>
      </div>

      {tab === "routines" && <RoutinesTab />}
      {tab === "skills" && <SkillsTab />}
      {tab === "integrations" && <IntegrationsTab />}
      {tab === "explore" && <ExploreTab />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "px-4 py-1.5 text-sm rounded-full transition-colors " +
        (active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="font-serif text-3xl text-foreground leading-tight">{title}</h1>
        {subtitle ? (
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

interface RoutineCard {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: string;
}

const myRoutines: RoutineCard[] = [
  {
    id: "auto-inbox",
    title: "Auto-inbox",
    description:
      "Keeps your inbox organized without the work. Labels new mail, drafts replies, and helps with scheduling.",
    icon: Inbox,
    tone: "bg-blue-100 text-blue-700",
  },
  {
    id: "meeting-briefing",
    title: "Meeting Briefing",
    description:
      "Prepares internal or external meeting briefings, emails them to you, saves each one in Ivy, and can pull in prior context.",
    icon: Search,
    tone: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "morning-briefing",
    title: "Morning Briefing",
    description:
      "A daily email with your schedule, urgent items that need attention, and updates on topics you care about.",
    icon: Sun,
    tone: "bg-amber-100 text-amber-700",
  },
];

const suggestedRoutines: RoutineCard[] = [
  {
    id: "auto-summarize",
    title: "Auto-summarize important attachments",
    description:
      "When an email arrives with a PDF, spreadsheet, or document attached, Ivy summarizes it for you.",
    icon: Sparkles,
    tone: "bg-orange-100 text-orange-700",
  },
  {
    id: "weekly-audio",
    title: "Weekly audio digest of important emails",
    description:
      "Every week I can turn your most important emails into a short audio digest for your commute.",
    icon: Mail,
    tone: "bg-orange-100 text-orange-700",
  },
  {
    id: "pre-meeting",
    title: "Pre-meeting context briefing",
    description:
      "Before meetings on your calendar, I can pull together relevant past emails and context.",
    icon: Users,
    tone: "bg-orange-100 text-orange-700",
  },
  {
    id: "decline-cold",
    title: "Decline Cold Outreach",
    description:
      "Politely declines unsolicited recruiter and sales emails by labeling cold outreach.",
    icon: Mail,
    tone: "bg-sky-100 text-sky-700",
  },
];

function RoutinesTab() {
  return (
    <div>
      <SectionHeader
        title="Routines"
        subtitle="Workflows that run on a schedule. Define what Ivy should do — every day, every week, or on a trigger."
        action={
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-border bg-card px-4 py-2 text-sm hover:bg-sidebar-accent transition">
              Trusted contacts
            </button>
            <button className="rounded-full bg-foreground text-background px-4 py-2 text-sm flex items-center gap-1.5 hover:opacity-90 transition">
              <Plus className="h-3.5 w-3.5" />
              Create routine
            </button>
          </div>
        }
      />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-foreground">My routines</h2>
        <div className="flex items-center gap-1 text-muted-foreground">
          <button className="p-1.5 hover:text-foreground">
            <Filter className="h-4 w-4" />
          </button>
          <button className="p-1.5 hover:text-foreground">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <LiveRoutines />

      <h2 className="text-sm font-medium text-foreground mb-4">Ideas from the catalog</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {myRoutines.map((r) => (
          <RoutineTile key={r.id} routine={r} suggested />
        ))}
      </div>

      <h2 className="text-sm font-medium text-foreground mb-4">Suggestions</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {suggestedRoutines.map((r) => (
          <RoutineTile key={r.id} routine={r} suggested />
        ))}
      </div>
    </div>
  );
}

function LiveRoutines() {
  // Real scheduled routines from the backend (Ivy runs these automatically).
  const { data: routines = [] } = useRoutines();
  const toggle = useToggleRoutine();
  const runNow = useRunRoutineNow();

  if (routines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-cream/40 px-6 py-8 text-center mb-10">
        <p className="text-sm text-muted-foreground">
          No routines yet. Ask Ivy on Home — e.g. "Every day at 8:30 tell me what needs my attention."
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
      {routines.map((r) => (
        <div
          key={r.id}
          className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] flex flex-col"
        >
          <div className="flex items-start justify-between mb-2">
            <span className="h-10 w-10 rounded-xl flex items-center justify-center bg-amber-100 text-amber-700">
              <Sun className="h-5 w-5" />
            </span>
            <Switch
              checked={r.enabled}
              onCheckedChange={(v) => toggle.mutate({ id: r.id, enabled: v })}
              aria-label="Toggle routine"
            />
          </div>
          <h3 className="font-medium text-foreground">{r.title}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5 capitalize">
            {r.schedule} · {r.time}
            {r.last_run_at ? " · last ran recently" : " · not run yet"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground flex-1">{r.prompt}</p>
          <button
            onClick={() => runNow.mutate(r.id)}
            disabled={runNow.isPending}
            className="mt-4 w-full rounded-lg border border-border text-sm py-2 hover:bg-sidebar-accent transition disabled:opacity-50"
          >
            {runNow.isPending ? "Running…" : "Run now"}
          </button>
        </div>
      ))}
    </div>
  );
}

function RoutineTile({
  routine,
  suggested,
}: {
  routine: RoutineCard;
  suggested?: boolean;
}) {
  const Icon = routine.icon;
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <span
          className={
            "h-10 w-10 rounded-xl flex items-center justify-center " + routine.tone
          }
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <h3 className="font-medium text-foreground">{routine.title}</h3>
      {suggested ? (
        <p className="text-[11px] text-muted-foreground mt-0.5">Suggested for you</p>
      ) : null}
      <p className="mt-2 text-sm text-muted-foreground flex-1">{routine.description}</p>
      {suggested ? (
        <button className="mt-4 w-full rounded-lg bg-foreground text-background text-sm py-2 hover:opacity-90 transition">
          Add
        </button>
      ) : null}
    </div>
  );
}

interface Skill {
  id: string;
  name: string;
  description: string;
  letter: string;
  tone: string;
  author: string;
  installs?: string;
}

const communitySkills: Skill[] = [
  {
    id: "linkedin-outreach",
    name: "LinkedIn Outreach Writer",
    description: "Drafts personalized LinkedIn messages based on a profile and your goal.",
    letter: "L",
    tone: "bg-blue-100 text-blue-700",
    author: "@marcus",
    installs: "2.3k",
  },
  {
    id: "invoice-parser",
    name: "Invoice Parser",
    description: "Extracts line items, totals, and due dates from invoice PDFs into a table.",
    letter: "I",
    tone: "bg-emerald-100 text-emerald-700",
    author: "@finance-tools",
    installs: "1.1k",
  },
  {
    id: "resume-screener",
    name: "Resume Screener",
    description: "Scores candidate resumes against a job description with reasoning.",
    letter: "R",
    tone: "bg-purple-100 text-purple-700",
    author: "@hrops",
    installs: "890",
  },
  {
    id: "meeting-notes",
    name: "Meeting Notes → Action Items",
    description: "Turns raw meeting transcripts into structured action items with owners.",
    letter: "M",
    tone: "bg-amber-100 text-amber-700",
    author: "@ivy",
    installs: "4.7k",
  },
  {
    id: "competitor-scan",
    name: "Competitor Scan",
    description: "Given a company name, produces a one-page competitive brief from public sources.",
    letter: "C",
    tone: "bg-rose-100 text-rose-700",
    author: "@growth",
    installs: "612",
  },
  {
    id: "sql-helper",
    name: "SQL Helper",
    description: "Translates plain-English questions into SQL against your schema.",
    letter: "S",
    tone: "bg-sky-100 text-sky-700",
    author: "@data",
    installs: "3.2k",
  },
];

function SkillsTab() {
  const [query, setQuery] = useState("");
  const filtered = communitySkills.filter((s) =>
    query ? s.name.toLowerCase().includes(query.toLowerCase()) : true,
  );

  return (
    <div>
      <SectionHeader
        title="Skills"
        subtitle="Skills are subagents Ivy spawns for specific tasks. Describe what you need — Ivy generates a subagent for you. Publish it to share with the community."
        action={
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-border bg-card px-4 py-2 text-sm flex items-center gap-1.5 hover:bg-sidebar-accent transition">
              <Upload className="h-3.5 w-3.5" />
              Upload
            </button>
            <button className="rounded-full bg-foreground text-background px-4 py-2 text-sm flex items-center gap-1.5 hover:opacity-90 transition">
              <Plus className="h-3.5 w-3.5" />
              Create skill
            </button>
          </div>
        }
      />

      <h2 className="text-sm font-medium text-foreground mb-4">My skills</h2>
      <MySkills />

      <h2 className="text-sm font-medium text-foreground mb-4">Ivy's core team</h2>
      <SystemTeam />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-medium text-foreground">Community skills</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Published by other Ivy users. Install to use them yourself.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 w-64">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills"
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border border-border bg-card p-4 flex flex-col shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-start justify-between mb-2">
              <span
                className={
                  "h-10 w-10 rounded-xl flex items-center justify-center font-medium " +
                  s.tone
                }
              >
                {s.letter}
              </span>
              <span className="text-[11px] text-muted-foreground">{s.installs} installs</span>
            </div>
            <h3 className="font-medium text-foreground text-sm">{s.name}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">by {s.author}</p>
            <p className="mt-2 text-xs text-muted-foreground flex-1">{s.description}</p>
            <button className="mt-3 w-full rounded-lg border border-border text-sm py-1.5 hover:bg-sidebar-accent transition">
              Install
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


const SKILL_TONES = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
];

function MySkills() {
  // Custom specialists Ivy spawned from user requests, plus system agents
  // that have "graduated" into an employee (has a display_name) and whose
  // integration is actually linked. System agents without a display_name
  // (meeting-agent, reminder-agent today) stay under "Ivy's core team".
  const { data: specialists = [] } = useSpecialists();
  const mine = specialists.filter(
    (s) => s.kind !== "system" || (s.display_name && s.connected !== false),
  );

  if (mine.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-cream/40 px-6 py-12 text-center mb-10">
        <p className="text-sm text-muted-foreground">
          No skills yet. Describe a task to Ivy and she'll spin up a subagent — publish it when it's ready.
        </p>
      </div>
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-10">
      {mine.map((s, i) => (
        <div
          key={s.id}
          className="rounded-2xl border border-border bg-card p-4 flex flex-col shadow-[var(--shadow-soft)]"
        >
          <div className="flex items-start justify-between mb-2">
            <span
              className={
                "h-10 w-10 rounded-xl flex items-center justify-center font-medium " +
                SKILL_TONES[i % SKILL_TONES.length]
              }
            >
              {(s.display_name ?? s.name).charAt(0).toUpperCase()}
            </span>
            <span className="text-[11px] text-muted-foreground">used {s.runs}x</span>
          </div>
          <h3 className="font-medium text-foreground text-sm">{s.display_name ?? s.name}</h3>
          <p className="mt-2 text-xs text-muted-foreground flex-1">{s.description}</p>
          <div className="mt-3 flex flex-wrap gap-1">
            {s.tools.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border/70 bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SystemTeam() {
  // The built-in domain agents that haven't graduated into "My Skills" —
  // i.e. don't have a display_name yet (meeting-agent, reminder-agent today).
  const { data: specialists = [] } = useSpecialists();
  const system = specialists.filter((s) => s.kind === "system" && !s.display_name);

  if (system.length === 0) {
    return (
      <p className="text-xs text-muted-foreground mb-10">
        Ivy's built-in email / meeting / reminder agents appear here once the backend is running.
      </p>
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-3 mb-10">
      {system.map((s) => (
        <div
          key={s.id}
          className="rounded-2xl border border-border bg-cream/50 p-4 shadow-[var(--shadow-soft)]"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground text-sm">{s.name}</h3>
            <span className="text-[10px] rounded-full border border-border bg-background px-2 py-0.5 text-muted-foreground">
              built-in
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{s.description}</p>
        </div>
      ))}
    </div>
  );
}

interface Integration {
  id: string;
  name: string;
  description: string;
  letter: string;
  tone: string;
  connected?: boolean;
}

const integrations: Integration[] = [
  { id: "airtable", name: "Airtable", description: "Read and write records", letter: "A", tone: "bg-yellow-100 text-yellow-700" },
  { id: "asana", name: "Asana", description: "Manage tasks and projects", letter: "A", tone: "bg-rose-100 text-rose-700" },
  { id: "ashby", name: "Ashby", description: "Candidates and jobs", letter: "A", tone: "bg-neutral-200 text-neutral-800" },
  { id: "attio", name: "Attio", description: "Search and update CRM", letter: "A", tone: "bg-neutral-200 text-neutral-800" },
  { id: "brex", name: "Brex", description: "Transactions and users", letter: "B", tone: "bg-orange-100 text-orange-700" },
  { id: "cal", name: "Cal.com", description: "Availability and bookings", letter: "C", tone: "bg-neutral-200 text-neutral-800" },
  { id: "calendly", name: "Calendly", description: "Scheduling and bookings", letter: "C", tone: "bg-blue-100 text-blue-700" },
  { id: "clickup", name: "ClickUp", description: "Search and manage tasks", letter: "C", tone: "bg-pink-100 text-pink-700" },
  { id: "coda", name: "Coda", description: "Read and update docs", letter: "C", tone: "bg-red-100 text-red-700" },
  { id: "copper", name: "Copper CRM", description: "Inspect and update CRM", letter: "C", tone: "bg-orange-100 text-orange-700" },
  { id: "cursor", name: "Cursor", description: "Manage cloud agents", letter: "C", tone: "bg-neutral-200 text-neutral-800" },
  { id: "dropbox", name: "Dropbox", description: "Read and share files", letter: "D", tone: "bg-blue-100 text-blue-700" },
  { id: "github", name: "GitHub", description: "Read repos and manage PRs", letter: "G", tone: "bg-neutral-200 text-neutral-800" },
  { id: "gitlab", name: "GitLab", description: "Repos, MRs, and issues", letter: "G", tone: "bg-orange-100 text-orange-700" },
  { id: "gong", name: "Gong", description: "Calls and transcripts", letter: "G", tone: "bg-purple-100 text-purple-700" },
  { id: "granola", name: "Granola", description: "Search meeting notes", letter: "G", tone: "bg-emerald-100 text-emerald-700" },
  { id: "hubspot", name: "HubSpot", description: "CRM contacts and deals", letter: "H", tone: "bg-orange-100 text-orange-700" },
  { id: "jira", name: "Jira", description: "Track issues and sprints", letter: "J", tone: "bg-blue-100 text-blue-700" },
  { id: "linear", name: "Linear", description: "Track issues and projects", letter: "L", tone: "bg-neutral-200 text-neutral-800" },
  { id: "linkedin", name: "LinkedIn", description: "Inspect LinkedIn profiles and orgs", letter: "L", tone: "bg-blue-100 text-blue-700" },
  { id: "monday", name: "Monday.com", description: "Work with Monday boards", letter: "M", tone: "bg-red-100 text-red-700" },
  { id: "notion", name: "Notion", description: "Pages and databases", letter: "N", tone: "bg-neutral-200 text-neutral-800" },
  { id: "pipedrive", name: "Pipedrive", description: "Search and update leads", letter: "P", tone: "bg-neutral-200 text-neutral-800" },
];

function IntegrationsTab() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "connected">("all");
  const { data: health } = useHealth();

  // Gmail status comes from the live backend; the rest is the catalog.
  const gmailConnected = health?.email_provider === "gmail";
  const all: Integration[] = [
    {
      id: "google",
      name: "Google (Gmail)",
      description: gmailConnected
        ? `Connected — read-only${health?.llm_model ? ` · drafts by ${health.llm_model}` : ""}`
        : "Not connected — run gmail_auth in the backend",
      letter: "G",
      tone: "bg-red-100 text-red-700",
      connected: gmailConnected,
    },
    ...integrations,
  ];

  const filtered = all.filter((i) => {
    if (filter === "connected" && !i.connected) return false;
    if (query && !i.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const connectedCount = all.filter((i) => i.connected).length;

  return (
    <div>
      <SectionHeader
        title="Integrations"
        subtitle="Google (Gmail + Calendar, read-only) is live today. The rest of the catalog is on the roadmap — marked Coming soon until each one actually works."
      />

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button className="rounded-full bg-foreground text-background px-4 py-2 text-sm flex items-center gap-1.5 hover:opacity-90 transition whitespace-nowrap">
          <Plus className="h-3.5 w-3.5" />
          Add MCP server
        </button>
      </div>

      <div className="flex items-center gap-4 mb-5 text-sm">
        <button
          onClick={() => setFilter("all")}
          className={
            "pb-1 border-b-2 " +
            (filter === "all"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground")
          }
        >
          All · {all.length}
        </button>
        <button
          onClick={() => setFilter("connected")}
          className={
            "pb-1 border-b-2 " +
            (filter === "connected"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground")
          }
        >
          Connected · {connectedCount}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((i) => {
          // Only Google is a real integration today; the rest are roadmap
          // entries and must not pretend to be connectable.
          const comingSoon = i.id !== "google";
          return (
            <div
              key={i.id}
              className={
                "rounded-2xl border border-border bg-card px-4 py-3 flex items-center gap-3 transition " +
                (comingSoon ? "opacity-55" : "hover:shadow-[var(--shadow-soft)]")
              }
            >
              <span
                className={
                  "h-10 w-10 rounded-xl flex items-center justify-center font-medium " +
                  i.tone
                }
              >
                {i.letter}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{i.name}</p>
                <p className="text-xs text-muted-foreground truncate">{i.description}</p>
              </div>
              {comingSoon ? (
                <span className="text-[10px] rounded-full border border-border bg-background px-2 py-0.5 text-muted-foreground whitespace-nowrap">
                  Coming soon
                </span>
              ) : i.connected ? (
                <span className="text-[10px] rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 whitespace-nowrap">
                  Connected
                </span>
              ) : (
                <span className="text-[10px] rounded-full border border-border bg-background px-2 py-0.5 text-muted-foreground whitespace-nowrap">
                  Not connected
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ExploreCard {
  id: string;
  title: string;
  description: string;
  letter: string;
  tone: string;
  createdBy: string;
}

const featuredExplore: ExploreCard[] = [
  {
    id: "decline-cold",
    title: "Decline Cold Outreach",
    description:
      "Politely declines unsolicited recruiter and sales emails by labeling cold outreach.",
    letter: "D",
    tone: "bg-sky-100 text-sky-700",
    createdBy: "Ivy",
  },
  {
    id: "competitive-intel",
    title: "Competitive Intel Briefing",
    description:
      "Periodic competitive intelligence briefing. Scans the web for news, launches, and mentions.",
    letter: "C",
    tone: "bg-amber-100 text-amber-700",
    createdBy: "Ivy",
  },
  {
    id: "contact-research",
    title: "Contact Research Dossier",
    description:
      "Automatically researches new contacts when an incoming email is from someone you don't know.",
    letter: "C",
    tone: "bg-emerald-100 text-emerald-700",
    createdBy: "Ivy",
  },
  {
    id: "deal-spotter",
    title: "Deal Spotter",
    description:
      "Scans incoming emails for sales and biz dev opportunities (inbound leads, warm intros).",
    letter: "D",
    tone: "bg-orange-100 text-orange-700",
    createdBy: "Ivy",
  },
];

const exploreRoutines: (RoutineCard & { added?: boolean })[] = [
  {
    id: "auto-inbox-x",
    title: "Auto-inbox",
    description: "Your inbox, organized without the work.",
    icon: Inbox,
    tone: "bg-blue-100 text-blue-700",
  },
  {
    id: "decline-cold-x",
    title: "Decline Cold Outreach",
    description: "Keep your inbox clear of unsolicited pitches.",
    icon: Mail,
    tone: "bg-sky-100 text-sky-700",
  },
  {
    id: "schedule-opt",
    title: "Schedule Optimizer",
    description: "Smarter weeks, fewer back-to-backs.",
    icon: CalendarClock,
    tone: "bg-teal-100 text-teal-700",
  },
  {
    id: "meeting-brief-x",
    title: "Meeting Briefing",
    description: "Get meeting prep in email and Ivy.",
    icon: Search,
    tone: "bg-emerald-100 text-emerald-700",
    added: true,
  } as any,
  {
    id: "contact-research-x",
    title: "Contact Research Dossier",
    description: "Executive-ready briefings for new contacts.",
    icon: TrendingUp,
    tone: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "morning-brief-x",
    title: "Morning Briefing",
    description: "Start your day knowing exactly what matters.",
    icon: Sun,
    tone: "bg-amber-100 text-amber-700",
    added: true,
  } as any,
];

function ExploreTab() {
  const categories = [
    "All",
    "Manage Your Inbox",
    "Manage Your Calendar",
    "Prepare for Meetings",
    "Stay Informed",
    "Nurture Relationships",
    "Streamline Operations",
  ];
  const [cat, setCat] = useState("All");

  return (
    <div>
      <SectionHeader
        title="Explore"
        subtitle="Discover routines and skills published by the Ivy community. Add them to your workspace with one click."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {featuredExplore.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] flex flex-col"
          >
            <span
              className={
                "h-10 w-10 rounded-xl flex items-center justify-center font-medium mb-3 " +
                c.tone
              }
            >
              {c.letter}
            </span>
            <h3 className="font-medium text-foreground">{c.title}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Created by {c.createdBy}
            </p>
            <p className="mt-2 text-sm text-muted-foreground flex-1">{c.description}</p>
            <button className="mt-4 w-full rounded-lg bg-foreground text-background text-sm py-2 hover:opacity-90 transition">
              Add
            </button>
          </div>
        ))}
      </div>

      <div className="mb-2">
        <h2 className="font-serif text-2xl text-foreground">Routines from Ivy</h2>
        <p className="text-sm text-muted-foreground">
          Pre-built routines to help you get started
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 my-4">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={
              "rounded-full px-3 py-1 text-xs border transition " +
              (cat === c
                ? "bg-foreground text-background border-foreground"
                : "bg-card border-border text-muted-foreground hover:text-foreground")
            }
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {exploreRoutines.map((r) => {
          const Icon = r.icon;
          const added = (r as any).added;
          return (
            <div
              key={r.id}
              className="rounded-2xl border border-border bg-card p-5 flex flex-col shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className={
                    "h-10 w-10 rounded-xl flex items-center justify-center " + r.tone
                  }
                >
                  <Icon className="h-5 w-5" />
                </span>
                {added ? (
                  <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    ✓ Added
                  </span>
                ) : (
                  <button className="rounded-full border border-border px-3 py-1 text-xs hover:bg-sidebar-accent">
                    Add
                  </button>
                )}
              </div>
              <h3 className="font-medium text-foreground">{r.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
