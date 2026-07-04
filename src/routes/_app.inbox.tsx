import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { mockEmails } from "@/lib/mock-data";
import { PageHeader } from "@/components/workspace/Common";
import { PriorityBadge, CategoryBadge } from "@/components/workspace/Badges";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/inbox")({
  head: () => ({
    meta: [
      { title: "Inbox — EmailOS AI" },
      { name: "description", content: "Your inbox, turned into a calm review queue." },
    ],
  }),
  component: InboxPage,
});

const tabs = ["All", "Need Reply", "Important", "FYI", "Low Priority"] as const;

function InboxPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");

  const filtered = mockEmails.filter((e) => {
    if (tab === "All") return true;
    return e.category === tab;
  });

  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-10 py-10">
      <PageHeader
        title="Your inbox, turned into a review queue."
        subtitle="EmailOS separates what matters from what can wait."
      />

      <div className="flex flex-wrap gap-1.5 mb-6">
        {tabs.map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "rounded-full border px-3.5 py-1.5 text-xs transition-colors " +
                (active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:bg-cream")
              }
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="grid gap-3">
        {filtered.map((e) => (
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
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
