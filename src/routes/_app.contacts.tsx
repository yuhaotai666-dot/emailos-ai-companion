import { createFileRoute } from "@tanstack/react-router";
import { mockContacts } from "@/lib/mock-data";
import { PageHeader } from "@/components/workspace/Common";

export const Route = createFileRoute("/_app/contacts")({
  head: () => ({
    meta: [
      { title: "People — EmailOS AI" },
      { name: "description", content: "People EmailOS has learned from your email history." },
    ],
  }),
  component: ContactsPage,
});

function ContactsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-10 py-10">
      <PageHeader
        title="People"
        subtitle="People EmailOS has learned from your email history."
      />
      <div className="grid sm:grid-cols-2 gap-3">
        {mockContacts.map((c) => (
          <article
            key={c.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-cream border border-border flex items-center justify-center text-sm font-medium text-foreground">
                {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground truncate">{c.email}</p>
              </div>
              <span className="ml-auto rounded-full border border-border bg-cream px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                {c.relationship}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{c.company}</p>
            <p className="mt-2 text-sm text-foreground/85">{c.recent}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-lg bg-cream/60 border border-border/60 px-2 py-1.5">
                <p className="uppercase tracking-wide text-muted-foreground">Tone</p>
                <p className="text-foreground">{c.tone}</p>
              </div>
              <div className="rounded-lg bg-cream/60 border border-border/60 px-2 py-1.5">
                <p className="uppercase tracking-wide text-muted-foreground">Last contact</p>
                <p className="text-foreground">{c.lastContact}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{c.notes}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
