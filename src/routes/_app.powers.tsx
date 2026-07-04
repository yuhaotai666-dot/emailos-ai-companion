import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
      { name: "twitter:card", content: "summary" },
    ],
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
        subtitle="Routines let your assistant handle recurring work with the right triggers, context, and actions."
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {myRoutines.map((r) => (
          <RoutineTile key={r.id} routine={r} />
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

function SkillsTab() {
  return (
    <div>
      <SectionHeader
        title="Skills"
        subtitle="Upload reusable skills that your assistant can use. Skills are directories with a SKILL.md file containing instructions."
        action={
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-border bg-card px-4 py-2 text-sm flex items-center gap-1.5 hover:bg-sidebar-accent transition">
              <Upload className="h-3.5 w-3.5" />
              Upload
            </button>
            <button className="rounded-full bg-foreground text-background px-4 py-2 text-sm flex items-center gap-1.5 hover:opacity-90 transition">
              <Plus className="h-3.5 w-3.5" />
              Create
            </button>
          </div>
        }
      />

      <h2 className="text-sm font-medium text-foreground mb-4">My skills</h2>
      <div className="rounded-2xl border border-dashed border-border bg-cream/40 px-6 py-16 text-center">
        <p className="text-sm text-muted-foreground">
          No skills yet. Ask your assistant to create one, or upload a SKILL.md or .zip archive.
        </p>
      </div>
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
  { id: "google", name: "Google", description: "1 account connected", letter: "G", tone: "bg-red-100 text-red-700", connected: true },
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

  const filtered = integrations.filter((i) => {
    if (filter === "connected" && !i.connected) return false;
    if (query && !i.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const connectedCount = integrations.filter((i) => i.connected).length;

  return (
    <div>
      <SectionHeader
        title="Integrations"
        subtitle="Connect the tools you use and let Ivy perform tasks across them."
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
          All · {integrations.length}
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
        {filtered.map((i) => (
          <div
            key={i.id}
            className="rounded-2xl border border-border bg-card px-4 py-3 flex items-center gap-3 hover:shadow-[var(--shadow-soft)] transition cursor-pointer"
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
          </div>
        ))}
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
      <SectionHeader title="Explore" />

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
