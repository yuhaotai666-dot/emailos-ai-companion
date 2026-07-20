import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { type MockEmail } from "@/lib/mock-data";
import { useEmails, useRunTriage } from "@/lib/api/queries";
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


export const Route = createFileRoute("/_app/inbox/")({
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
  const [markedDoneIds, setMarkedDoneIds] = useState<Set<string>>(new Set());

  const finished = useFinishedEmailsStore((s) => s.finished);
  const markSent = useFinishedEmailsStore((s) => s.markSent);
  const markDone = useFinishedEmailsStore((s) => s.markDone);

  function handleView(e: MockEmail) {
    setOpenEmail(e);
    setReplyBody(e.draftBody ?? e.draftPreview ?? "");
  }

  function handleSendReply(emailId: string) {
    markSent(emailId);
    setOpenEmail(null);
  }

  function handleMarkDone(emailId: string) {
    setMarkedDoneIds((prev) => {
      const next = new Set(prev);
      if (next.has(emailId)) next.delete(emailId);
      else next.add(emailId);
      return next;
    });
  }

  function handleRefresh() {
    for (const id of markedDoneIds) markDone(id);
    setMarkedDoneIds(new Set());
  }

  const emailEventMap = useEventsStore((s) => s.emailEventMap);
  const events = useEventsStore((s) => s.events);

  const { data: emails = [], isLoading } = useEmails();
  const runTriage = useRunTriage();

  // The review queue only surfaces emails that actually need a reply. FYI /
  // newsletters / no-action mail is filtered out. A freshly-arrived reply that
  // hasn't been triaged yet (needsRetriage) is kept — it's an inbound message
  // awaiting analysis, not something to hide.
  const visibleEmails = emails.filter(
    (e) => !finished[e.id] && (e.needsReply || e.needsRetriage),
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

  // Review-queue order: High → Medium → Low → untriaged. Priority values are
  // lowercased by the mapper; untriaged messages (no real classification yet)
  // sink to the bottom. Stable sort keeps newest-first within a priority band.
  const PRIORITY_RANK: Record<string, number> = { high: 0, medium: 1, low: 2 };
  const rankOf = (e: MockEmail) => (e.triaged ? PRIORITY_RANK[e.priority] ?? 2 : 3);
  const sorted = [...filtered].sort((a, b) => rankOf(a) - rankOf(b));

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
        <div className="flex items-center gap-2 ml-4 shrink-0">
          <Button
            size="sm"
            className="rounded-full h-8 text-xs bg-foreground text-background hover:opacity-90"
            disabled={runTriage.isPending}
            onClick={() => runTriage.mutate()}
          >
            <RefreshCw
              className={"h-3.5 w-3.5 mr-1" + (runTriage.isPending ? " animate-spin" : "")}
            />
            {runTriage.isPending ? "Running…" : "Run triage"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full h-8 text-xs"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Refresh
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full h-8 text-xs">
            <Link to="/inbox/finished">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Task finished
            </Link>
          </Button>
        </div>
      </div>


      <div className="grid gap-3">
        {sorted.map((e) => {
          const evId = emailEventMap[e.id];
          const ev = events.find((x) => x.id === evId);
          return (
            <article
              key={e.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] h-[240px] overflow-hidden flex flex-col"
            >
              <div className="flex items-start justify-between gap-4 shrink-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground">{e.sender}</p>
                    <p className="text-xs text-muted-foreground">{e.senderEmail}</p>
                    <span className="text-xs text-muted-foreground">· {e.time}</span>
                  </div>
                  <h3 className="mt-1 text-base font-medium text-foreground line-clamp-1">{e.subject}</h3>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {e.triaged ? (
                    <>
                      <PriorityBadge priority={e.priority} />
                      <CategoryBadge category={e.category} />
                    </>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-dashed border-border bg-cream/60 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                      Untriaged
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-3 text-sm text-foreground/85 leading-relaxed line-clamp-2 shrink-0">{e.summary}</p>

              <div className="mt-4 flex-1 min-h-0 overflow-hidden">
                {e.needsRetriage || !e.suggestedAction ? (
                  <div className="rounded-xl border border-dashed border-border/70 bg-cream/40 px-3 py-2.5 flex items-center gap-2 h-full">
                    <RefreshCw className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {e.needsRetriage
                        ? "A newer reply arrived — run triage to refresh the analysis for this message."
                        : "Not analyzed yet — run triage to generate a suggested action and draft."}
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3 h-full">
                    <div className="rounded-xl bg-cream/60 border border-border/60 px-3 py-2 overflow-hidden">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Suggested action</p>
                      <p className="text-xs text-foreground mt-0.5 line-clamp-4">{e.suggestedAction}</p>
                    </div>
                    <div className="rounded-xl bg-cream/60 border border-border/60 px-3 py-2 overflow-hidden">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Why this matters</p>
                      <p className="text-xs text-foreground mt-0.5 line-clamp-4">{e.reason}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 shrink-0">
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
              {isLoading ? "Loading your inbox…" : "No emails match this filter combination."}
            </p>
          </div>
        )}
      </div>

      <ManageEventsDialog open={manageOpen} onOpenChange={setManageOpen} />

      <Sheet open={!!openEmail} onOpenChange={(o) => !o && setOpenEmail(null)}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-3xl p-0 flex flex-col bg-background"
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
                    {openEmail.triaged ? (
                      <>
                        <PriorityBadge priority={openEmail.priority} />
                        <CategoryBadge category={openEmail.category} />
                      </>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-dashed border-border bg-cream/60 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                        Untriaged
                      </span>
                    )}
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
                    Latest message
                  </p>
                  <div className="rounded-2xl border-2 border-border bg-cream/40 max-h-[800px] overflow-y-auto">
                    {/* Gmail-style header: who sent it, to whom, when. */}
                    <div className="flex items-start gap-3 px-6 pt-5 pb-3 border-b border-border/60">
                      <div className="h-9 w-9 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-medium text-foreground shrink-0">
                        {openEmail.sender.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {openEmail.sender}{" "}
                          <span className="font-normal text-muted-foreground">
                            &lt;{openEmail.senderEmail}&gt;
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">to me · {openEmail.time}</p>
                      </div>
                    </div>
                    <div className="px-6 py-4 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                      {openEmail.bodyPreview
                        ? openEmail.bodyPreview
                        : `${openEmail.summary}\n\n${openEmail.reason}`}
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Showing the latest message in this thread. Earlier replies are quoted in Gmail.
                  </p>
                </div>

              </div>

              <div className="border-t border-border bg-cream/30 px-6 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Reply to {openEmail.sender}
                  </p>
                  {(openEmail.draftBody ?? openEmail.draftPreview) && (
                    <button
                      onClick={() => setReplyBody(openEmail.draftBody ?? openEmail.draftPreview ?? "")}
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
