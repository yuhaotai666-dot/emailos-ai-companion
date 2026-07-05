import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { mockEmails, type MockEmail } from "@/lib/mock-data";
import { PageHeader } from "@/components/workspace/Common";
import { PriorityBadge, CategoryBadge } from "@/components/workspace/Badges";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useEventsStore } from "@/lib/events-store";
import { EventFilterBar } from "@/components/workspace/EventFilterBar";
import { EventLabelPicker } from "@/components/workspace/EventLabelPicker";
import { ManageEventsDialog } from "@/components/workspace/ManageEventsDialog";
import { useFinishedEmailsStore } from "@/lib/finished-emails-store";
import { Send, X, RefreshCw, CheckCircle2 } from "lucide-react";


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
  const [openEmail, setOpenEmail] = useState<MockEmail | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

  const finished = useFinishedEmailsStore((s) => s.finished);
  const markSent = useFinishedEmailsStore((s) => s.markSent);
  const markDone = useFinishedEmailsStore((s) => s.markDone);
  const unmarkDone = useFinishedEmailsStore((s) => s.unmarkDone);

  function handleView(e: MockEmail) {
    setOpenEmail(e);
    setReplyBody(e.draftPreview ?? "");
  }

  function handleSendReply(emailId: string) {
    markSent(emailId);
    setOpenEmail(null);
  }

  function handleMarkDone(emailId: string) {
    if (finished[emailId] === "done") {
      unmarkDone(emailId);
    } else {
      markDone(emailId);
    }
  }

  function handleRefresh() {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      for (const [id, kind] of Object.entries(finished)) {
        if (kind === "done") next.add(id);
      }
      return next;
    });
  }

  const emailEventMap = useEventsStore((s) => s.emailEventMap);
  const events = useEventsStore((s) => s.events);

  const visibleEmails = mockEmails.filter(
    (e) => finished[e.id] !== "sent" && !hiddenIds.has(e.id),
  );

  const priorityFiltered = visibleEmails;

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

      <div className="mb-6 flex items-center justify-between">
        <EventFilterBar
          value={eventFilter}
          onChange={setEventFilter}
          counts={counts}
          totalCount={priorityFiltered.length}
          onManage={() => setManageOpen(true)}
        />
        <Button
          variant="outline"
          size="sm"
          className="rounded-full h-8 text-xs ml-4 shrink-0"
          onClick={handleRefresh}
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          Refresh
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
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full h-8 text-xs bg-background"
                  onClick={() => handleView(e)}
                >
                  View
                </Button>
                <Button
                  variant={markedDoneIds.has(e.id) ? "default" : "outline"}
                  size="sm"
                  className="rounded-full h-8 text-xs"
                  onClick={() => handleMarkDone(e.id)}
                >
                  {markedDoneIds.has(e.id) ? "Marked" : "Mark Done"}
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
              No emails match this filter combination.
            </p>
          </div>
        )}
      </div>

      <ManageEventsDialog open={manageOpen} onOpenChange={setManageOpen} />

      <Sheet open={!!openEmail} onOpenChange={(o) => !o && setOpenEmail(null)}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl p-0 flex flex-col bg-background"
        >
          {openEmail && (
            <>
              <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <SheetTitle className="font-serif text-2xl leading-tight text-foreground">
                      {openEmail.subject}
                    </SheetTitle>
                    <SheetDescription className="mt-1 text-xs text-muted-foreground">
                      {openEmail.sender} · {openEmail.senderEmail} · {openEmail.time}
                    </SheetDescription>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <PriorityBadge priority={openEmail.priority} />
                    <CategoryBadge category={openEmail.category} />
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
                    Full message
                  </p>
                  <div className="rounded-2xl border border-border bg-cream/40 px-4 py-4 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {`Hi Theo,\n\n${openEmail.summary}\n\n${
                      openEmail.reason
                    }\n\nBest,\n${openEmail.sender}`}
                  </div>
                </div>

              </div>

              <div className="border-t border-border bg-cream/30 px-6 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Reply to {openEmail.sender}
                  </p>
                  {openEmail.draftPreview && (
                    <button
                      onClick={() => setReplyBody(openEmail.draftPreview ?? "")}
                      className="text-[11px] text-muted-foreground hover:text-foreground"
                    >
                      Reset to Ivy's draft
                    </button>
                  )}
                </div>
                <Textarea
                  value={replyBody}
                  onChange={(ev) => setReplyBody(ev.target.value)}
                  placeholder="Write your reply…"
                  className="min-h-32 resize-none bg-background border-border"
                />
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full h-8 text-xs"
                    onClick={() => setOpenEmail(null)}
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Close
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-full h-8 text-xs bg-foreground text-background hover:opacity-90"
                    disabled={!replyBody.trim()}
                    onClick={() => openEmail && handleSendReply(openEmail.id)}
                  >
                    <Send className="h-3.5 w-3.5 mr-1" />
                    Send reply
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
