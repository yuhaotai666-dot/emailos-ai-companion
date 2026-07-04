import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useEmails, useRunTriage } from "@/lib/api/queries";
import { PageHeader } from "@/components/workspace/Common";
import { PriorityBadge, CategoryBadge } from "@/components/workspace/Badges";
import { Button } from "@/components/ui/button";
import { useEventsStore } from "@/lib/events-store";
import { EventFilterBar } from "@/components/workspace/EventFilterBar";
import { EventLabelPicker } from "@/components/workspace/EventLabelPicker";
import { ManageEventsDialog } from "@/components/workspace/ManageEventsDialog";

export const Route = createFileRoute("/_app/inbox")({
  head: () => ({
    meta: [
      { title: "Email — Ivy" },
      { name: "description", content: "Your email, turned into a calm review queue." },
    ],
  }),
  component: InboxPage,
});

function InboxPage() {
  const [eventFilter, setEventFilter] = useState<string | "all">("all");
  const [manageOpen, setManageOpen] = useState(false);

  const emailEventMap = useEventsStore((s) => s.emailEventMap);
  const events = useEventsStore((s) => s.events);

  const { data: emails = [], isLoading } = useEmails();
  const runTriage = useRunTriage();

  const priorityFiltered = emails;

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const e of priorityFiltered) {
      const evId = emailEventMap[e.id];
      if (evId) c[evId] = (c[evId] ?? 0) + 1;
    }
    return c;
  }, [priorityFiltered, emailEventMap]);

  const filtered = priorityFiltered.filter((e) =>
    eventFilter === "all" ? true : emailEventMap[e.id] === eventFilter,
  );

  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-10 py-10">
      <PageHeader
        title="Your email, turned into a review queue."
        subtitle="Ivy separates what matters from what can wait."
      />

      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <EventFilterBar
            value={eventFilter}
            onChange={setEventFilter}
            counts={counts}
            totalCount={priorityFiltered.length}
            onManage={() => setManageOpen(true)}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full h-8 text-xs bg-background gap-1.5 shrink-0"
          disabled={runTriage.isPending}
          onClick={() => runTriage.mutate()}
        >
          <RefreshCw className={"h-3 w-3" + (runTriage.isPending ? " animate-spin" : "")} />
          {runTriage.isPending ? "Running…" : "Run triage"}
        </Button>
      </div>


      <div className="grid gap-3">
        {filtered.map((e) => {
          const evId = emailEventMap[e.id];
          const ev = events.find((x) => x.id === evId);
          return (
            <article
              key={e.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground">{e.sender}</p>
                    <p className="text-xs text-muted-foreground">{e.senderEmail}</p>
                    <span className="text-xs text-muted-foreground">· {e.time}</span>
                  </div>
                  <h3 className="mt-1 text-base font-medium text-foreground">{e.subject}</h3>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <PriorityBadge priority={e.priority} />
                  <CategoryBadge category={e.category} />
                </div>
              </div>

              <p className="mt-3 text-sm text-foreground/85 leading-relaxed">{e.summary}</p>

              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-cream/60 border border-border/60 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Suggested action</p>
                  <p className="text-xs text-foreground mt-0.5">{e.suggestedAction}</p>
                </div>
                <div className="rounded-xl bg-cream/60 border border-border/60 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Why this matters</p>
                  <p className="text-xs text-foreground mt-0.5">{e.reason}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-full h-8 text-xs bg-background">
                  View
                </Button>
                <Button size="sm" className="rounded-full h-8 text-xs bg-foreground text-background hover:opacity-90">
                  Draft Reply
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full h-8 text-xs">
                  Mark Done
                </Button>
                <EventLabelPicker emailId={e.id} onManage={() => setManageOpen(true)} />
                {ev && (
                  <span className="ml-auto text-[11px] text-muted-foreground hidden sm:inline">
                    Event: {ev.name}
                  </span>
                )}
              </div>
            </article>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading your inbox…" : "No emails match this filter combination."}
            </p>
          </div>
        )}
      </div>

      <ManageEventsDialog open={manageOpen} onOpenChange={setManageOpen} />
    </div>
  );
}
