import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { mockDrafts } from "@/lib/mock-data";
import { PageHeader, TrustBanner } from "@/components/workspace/Common";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AlertTriangle, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_app/drafts")({
  head: () => ({
    meta: [
      { title: "Drafts — EmailOS AI" },
      { name: "description", content: "High-quality drafts, ready for your review." },
    ],
  }),
  component: DraftsPage,
});

function DraftsPage() {
  const [open, setOpen] = useState<string | null>(null);
  const current = mockDrafts.find((d) => d.id === open);
  const [body, setBody] = useState("");
  const [tone, setTone] = useState("Professional");

  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-10 py-10">
      <PageHeader
        title="Drafts waiting for review"
        subtitle="Stop writing from scratch. Start reviewing high-quality drafts."
      />
      <div className="mb-4">
        <TrustBanner>
          EmailOS never sends emails automatically. Approved drafts are prepared for you to send.
        </TrustBanner>
      </div>

      <div className="grid gap-3">
        {mockDrafts.map((d) => (
          <article
            key={d.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">To</p>
                <p className="text-sm font-medium text-foreground">
                  {d.to} <span className="text-muted-foreground font-normal">· {d.toEmail}</span>
                </p>
                <h3 className="mt-1 text-base font-medium text-foreground">{d.subject}</h3>
              </div>
              <span className="rounded-full border border-border bg-cream px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                {d.tone}
              </span>
            </div>

            <div className="mt-3 rounded-xl bg-cream/60 border border-border/60 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Original</p>
              <p className="text-xs text-foreground mt-0.5">{d.originalSummary}</p>
            </div>

            <div className="mt-3 rounded-xl border border-border bg-background px-4 py-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Draft reply</p>
              <p className="mt-1 text-sm text-foreground/90 leading-relaxed">{d.body}</p>
            </div>

            {d.risk ? (
              <p className="mt-3 flex items-center gap-2 text-xs text-[oklch(0.5_0.13_40)]">
                <AlertTriangle className="h-3.5 w-3.5" /> {d.risk}
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full h-8 text-xs bg-background"
                onClick={() => {
                  setBody(d.body);
                  setTone(d.tone);
                  setOpen(d.id);
                }}
              >
                Edit
              </Button>
              <Button
                size="sm"
                className="rounded-full h-8 text-xs bg-foreground text-background hover:opacity-90"
                onClick={() => toast.success("Draft approved — ready to send from Gmail.")}
              >
                Approve
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-8 text-xs"
                onClick={() => toast("Opening in Gmail…")}
              >
                Open in Gmail
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-8 text-xs"
                onClick={() => toast("Regenerating draft…")}
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Regenerate
              </Button>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Review draft</DialogTitle>
          </DialogHeader>
          {current ? (
            <div className="grid md:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-border bg-cream/60 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Original</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {current.to} · {current.toEmail}
                </p>
                <p className="mt-2 text-sm text-foreground/85 leading-relaxed">
                  {current.originalSummary}
                </p>
              </div>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Draft</p>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="h-8 w-32 rounded-full text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Friendly">Friendly</SelectItem>
                      <SelectItem value="Direct">Direct</SelectItem>
                      <SelectItem value="Concise">Concise</SelectItem>
                      <SelectItem value="Warm">Warm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="min-h-[220px] rounded-2xl bg-background"
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => toast("Regenerating draft…")}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" /> Regenerate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs bg-background"
                    onClick={() => {
                      toast.success("Draft saved.");
                      setOpen(null);
                    }}
                  >
                    Save draft
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-full text-xs bg-foreground text-background hover:opacity-90 ml-auto"
                    onClick={() => {
                      toast.success("Gmail draft created.");
                      setOpen(null);
                    }}
                  >
                    Create Gmail draft
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
