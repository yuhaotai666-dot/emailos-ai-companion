import { createFileRoute } from "@tanstack/react-router";
import { mockFollowUps } from "@/lib/mock-data";
import { PageHeader } from "@/components/workspace/Common";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/follow-ups")({
  head: () => ({
    meta: [
      { title: "Follow-ups — EmailOS AI" },
      { name: "description", content: "Promises, pending replies, and next steps." },
    ],
  }),
  component: FollowUpsPage,
});

function FollowUpsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-10 py-10">
      <PageHeader
        title="Follow-ups"
        subtitle="Promises, pending replies, and next steps EmailOS found in your emails."
      />
      <div className="grid gap-3">
        {mockFollowUps.map((f) => (
          <article
            key={f.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Person</p>
                <p className="text-sm font-medium text-foreground">{f.person}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-border bg-cream px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {f.status}
                </span>
                <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] text-muted-foreground">
                  Due {f.due}
                </span>
              </div>
            </div>
            <p className="mt-3 text-sm text-foreground/85 leading-relaxed">{f.context}</p>
            <div className="mt-3 rounded-xl border border-border bg-background px-4 py-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Suggested follow-up</p>
              <p className="mt-1 text-sm text-foreground/90 leading-relaxed">{f.suggested}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" className="rounded-full h-8 text-xs bg-foreground text-background hover:opacity-90">
                Draft follow-up
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full h-8 text-xs">
                Mark done
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
