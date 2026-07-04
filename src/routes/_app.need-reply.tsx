import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { mockEmails } from "@/lib/mock-data";
import { PageHeader, TrustBanner } from "@/components/workspace/Common";
import { PriorityBadge } from "@/components/workspace/Badges";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/need-reply")({
  head: () => ({
    meta: [
      { title: "Needs Reply — EmailOS AI" },
      { name: "description", content: "Emails EmailOS thinks require your response." },
    ],
  }),
  component: NeedReplyPage,
});

const filters = ["All", "High Priority", "Creator Partnership", "Payment", "Meeting", "Sales", "Product Access"] as const;

function NeedReplyPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const items = mockEmails.filter((e) => {
    if (!e.needsReply) return false;
    if (filter === "All") return true;
    if (filter === "High Priority") return e.priority === "high";
    return e.filter === filter;
  });

  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-10 py-10">
      <PageHeader
        title="Needs your reply"
        subtitle="These are emails EmailOS thinks require your response."
      />
      <div className="mb-4">
        <TrustBanner>EmailOS drafts. You approve.</TrustBanner>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {filters.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                "rounded-full border px-3.5 py-1.5 text-xs transition-colors " +
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

      <div className="grid gap-3">
        {items.map((e) => (
          <article
            key={e.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{e.sender}</p>
                <h3 className="mt-0.5 text-base font-medium text-foreground">{e.subject}</h3>
              </div>
              <PriorityBadge priority={e.priority} />
            </div>

            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-cream/60 border border-border/60 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Why this needs a reply</p>
                <p className="text-xs text-foreground mt-0.5">{e.reason}</p>
              </div>
              <div className="rounded-xl bg-cream/60 border border-border/60 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Suggested direction</p>
                <p className="text-xs text-foreground mt-0.5">{e.suggestedAction}</p>
              </div>
            </div>

            {e.draftPreview ? (
              <div className="mt-3 rounded-xl border border-border bg-background px-4 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">AI draft preview</p>
                  {typeof e.confidence === "number" ? (
                    <span className="text-[10px] text-muted-foreground">Confidence {e.confidence}%</span>
                  ) : null}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">{e.draftPreview}</p>
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button size="sm" className="rounded-full h-8 text-xs bg-foreground text-background hover:opacity-90">
                Review Draft
              </Button>
              <Button variant="outline" size="sm" className="rounded-full h-8 text-xs bg-background">
                Create Gmail Draft
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full h-8 text-xs">
                Ignore
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
