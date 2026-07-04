import { createFileRoute, Link } from "@tanstack/react-router";
import { mockPeople } from "@/lib/mock-data";
import { PageHeader } from "@/components/workspace/Common";
import { RelationshipBadge, StatusBadge } from "@/components/workspace/Badges";
import { Button } from "@/components/ui/button";
import { Plus, Download, Contact, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/people")({
  head: () => ({
    meta: [
      { title: "People — Ivy" },
      {
        name: "description",
        content:
          "AI-generated relationship profiles built from your email, meetings, and follow-ups.",
      },
    ],
  }),
  component: PeoplePage,
});

function PeoplePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-10 py-10">
      <PageHeader
        title="People"
        subtitle="Working profiles Ivy builds from your conversations."
      />

      <div className="rounded-2xl border border-border bg-cream/70 px-4 py-3 text-sm text-foreground/85 flex items-start gap-3 mb-4">
        <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border">
          <Sparkles className="h-3 w-3 text-accent" />
        </span>
        <p className="flex-1">
          Ivy builds working profiles from your conversations. You can edit or delete
          anything it remembers.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          size="sm"
          className="rounded-full"
          onClick={() => toast("Create contact — coming soon.")}
        >
          <Plus className="h-3.5 w-3.5" /> Create contact
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full"
          onClick={() => toast("Import contacts — coming soon.")}
        >
          <Download className="h-3.5 w-3.5" /> Import contacts
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full"
          onClick={() => toast("Google Contacts sync — coming soon.")}
        >
          <Contact className="h-3.5 w-3.5" /> Enable Google Contacts
        </Button>
      </div>

      <div className="grid gap-3">
        {mockPeople.map((p) => (
          <Link
            key={p.id}
            to="/people/$personId"
            params={{ personId: p.id }}
            className="group rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] hover:border-foreground/20 transition-colors"
          >
            <div className="flex items-start gap-4">
              <span className="h-11 w-11 shrink-0 rounded-full bg-cream border border-border flex items-center justify-center text-sm font-medium text-foreground">
                {p.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                  <span className="text-xs text-muted-foreground">·</span>
                  <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {p.company} · {p.channel}
                  </span>
                  <RelationshipBadge type={p.relationship} />
                  <StatusBadge status={p.status} />
                </div>
                <p className="mt-2 text-sm text-foreground/85 line-clamp-2">
                  {p.aiDescription}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                  <span>Last contacted {p.lastContacted}</span>
                  <span className="rounded-full border border-border bg-cream px-2 py-0.5">
                    {p.openThreads} open {p.openThreads === 1 ? "thread" : "threads"}
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                Open <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
