import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Inbox,
  CalendarDays,
  ListChecks,
  Calendar,
  Users,
  Brain,
  Settings,
  Search,
  Plus,
  Sparkles,
} from "lucide-react";
import { mockAssistant, mockUser } from "@/lib/mock-data";

const items = [
  { title: "Home", url: "/home", icon: Home },
  { title: "Email", url: "/inbox", icon: Inbox },
  { title: "Calendar", url: "/calendar", icon: CalendarDays },
  { title: "To-do", url: "/todo", icon: ListChecks },
  { title: "Meetings", url: "/meetings", icon: Calendar },
  { title: "People", url: "/people", icon: Users },
  { title: "Memory", url: "/memory", icon: Brain },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar h-screen sticky top-0">
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm font-medium text-foreground">Ivy</span>
        </div>
      </div>

      <div className="px-3">
        <div className="flex items-center gap-2 rounded-full bg-background border border-border px-3 py-1.5 text-xs text-muted-foreground">
          <Search className="h-3.5 w-3.5" />
          <span>Search</span>
          <span className="ml-auto rounded bg-cream px-1.5 py-0.5 text-[10px] tracking-wide">⌘K</span>
        </div>
        <button className="mt-2 w-full flex items-center gap-2 rounded-full bg-foreground text-background px-3 py-1.5 text-xs hover:opacity-90 transition">
          <Plus className="h-3.5 w-3.5" /> New
        </button>
      </div>

      <nav className="mt-4 px-2 flex-1 overflow-y-auto">
        <ul className="grid gap-0.5">
          {items.map((it) => {
            const active = pathname === it.url;
            return (
              <li key={it.url}>
                <Link
                  to={it.url}
                  className={
                    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors " +
                    (active
                      ? "bg-background text-foreground shadow-[var(--shadow-soft)] border border-border"
                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent")
                  }
                >
                  <it.icon className="h-4 w-4" />
                  <span>{it.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 border-t border-border grid gap-2">
        <div className="flex items-center gap-2 rounded-xl bg-background border border-border px-3 py-2">
          <span className="h-7 w-7 rounded-lg bg-cream border border-border flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{mockAssistant.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{mockAssistant.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-background border border-border px-3 py-2">
          <span className="h-7 w-7 rounded-full bg-foreground text-background flex items-center justify-center text-[11px] font-medium">
            {mockUser.name[0]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-foreground truncate">{mockUser.fullName}</p>
            <p className="text-[10px] text-muted-foreground truncate">{mockUser.plan}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
