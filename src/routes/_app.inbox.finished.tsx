import { createFileRoute, Link } from "@tanstack/react-router";
import { useEmails } from "@/lib/api/queries";
import { PageHeader } from "@/components/workspace/Common";
import { PriorityBadge, CategoryBadge } from "@/components/workspace/Badges";
import { Button } from "@/components/ui/button";
import { useFinishedEmailsStore } from "@/lib/finished-emails-store";
import { ArrowLeft, Send, CheckCircle2, Undo2 } from "lucide-react";

export const Route = createFileRoute("/_app/inbox/finished")({
  head: () => ({
    meta: [
      { title: "Task finished — Ivy" },
      { name: "description", content: "Emails you've sent replies to or marked as done." },
    ],
  }),
  component: FinishedPage,
});

function FinishedPage() {
  const finished = useFinishedEmailsStore((s) => s.finished);
  const remove = useFinishedEmailsStore((s) => s.remove);
  const { data: emails = [] } = useEmails();

  const items = emails
    .filter((e) => finished[e.id])
    .map((e) => ({ email: e, kind: finished[e.id] }));

  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-10 py-10">
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm" className="rounded-full h-8 text-xs -ml-2">
          <Link to="/inbox">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to email
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Task finished"
        subtitle="Emails you've replied to or marked as done."
      />

      <div className="mt-6 grid gap-3">
        {items.map(({ email: e, kind }) => (
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

            <div className="mt-4 flex items-center gap-2">
              <span
                className={
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] " +
                  (kind === "sent"
                    ? "border-border bg-cream text-foreground"
                    : "border-border bg-background text-foreground")
                }
              >
                {kind === "sent" ? (
                  <>
                    <Send className="h-3 w-3" /> Reply sent
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3 w-3" /> Marked done
                  </>
                )}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-8 text-xs ml-auto"
                onClick={() => remove(e.id)}
              >
                <Undo2 className="h-3.5 w-3.5 mr-1" />
                Return to inbox
              </Button>
            </div>
          </article>
        ))}

        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
            <p className="text-sm text-muted-foreground">
              No finished emails yet. Send a reply or mark an email as done to see it here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
