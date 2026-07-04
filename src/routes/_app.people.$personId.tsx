import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { mockPeople, type Person } from "@/lib/mock-data";
import {
  RelationshipBadge,
  StatusBadge,
  ConfidenceBadge,
} from "@/components/workspace/Badges";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  Calendar,
  StickyNote,
  Sparkles,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/people/$personId")({
  head: ({ params }) => {
    const p = mockPeople.find((x) => x.id === params.personId);
    return {
      meta: [
        { title: p ? `${p.name} — People — Ivy` : "Person — Ivy" },
        {
          name: "description",
          content: p
            ? p.aiDescription
            : "AI-generated relationship profile in Ivy.",
        },
      ],
    };
  },
  loader: ({ params }) => {
    const person = mockPeople.find((p) => p.id === params.personId);
    if (!person) throw notFound();
    return { person };
  },
  notFoundComponent: PersonNotFound,
  component: PersonDetail,
});

function PersonNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <h1 className="font-serif text-3xl text-foreground">Person not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Ivy doesn't have a profile for this person yet.
      </p>
      <Link
        to="/people"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 text-sm"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to People
      </Link>
    </div>
  );
}

function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={
        "rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] " + className
      }
    >
      <h2 className="font-serif text-xl text-foreground">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

const sourceIcons = {
  email: Mail,
  meeting: Calendar,
  "manual note": StickyNote,
} as const;

function PersonDetail() {
  const { person: p } = Route.useLoaderData() as { person: Person };

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-10 py-10">
      <Link
        to="/people"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> People
      </Link>

      <header className="flex flex-wrap items-start gap-4 mb-6">
        <span className="h-14 w-14 rounded-full bg-cream border border-border flex items-center justify-center text-base font-medium text-foreground">
          {p.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight">
            {p.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {p.role} · {p.company}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <RelationshipBadge type={p.relationship} />
            <StatusBadge status={p.status} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            onClick={() => toast("Edit profile — coming soon.")}
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full text-destructive hover:text-destructive"
            onClick={() => toast("Profile deleted from memory.")}
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 grid gap-4 content-start">
          <Section title="Contact">
            <dl className="grid gap-2 text-sm">
              <Row label="Email" value={p.email} />
              <Row label="Company" value={p.company} />
              <Row label="Role" value={p.role} />
              <Row label="Channel" value={p.channel} />
              {p.website && <Row label="Website" value={p.website} />}
              {p.socials?.twitter && <Row label="Twitter" value={p.socials.twitter} />}
              {p.socials?.youtube && <Row label="YouTube" value={p.socials.youtube} />}
              {p.socials?.linkedin && <Row label="LinkedIn" value={p.socials.linkedin} />}
            </dl>
          </Section>

          <Section title="Suggested next action" className="bg-cream/70">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-background border border-border">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
              </span>
              <div className="flex-1">
                <p className="text-sm text-foreground">{p.suggestedNextAction}</p>
                <Button
                  size="sm"
                  className="mt-3 rounded-full"
                  onClick={() => toast("Draft opened for review.")}
                >
                  Take action <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Section>

          <Section title="Communication style">
            <div className="flex flex-wrap gap-1.5">
              {p.communicationStyle.tone.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-cream px-2 py-0.5 text-[11px] text-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm text-foreground/85">
              {p.communicationStyle.notes}
            </p>
          </Section>
        </div>

        <div className="lg:col-span-2 grid gap-4 content-start">
          <Section title="Who they are">
            <p className="text-sm text-foreground/85 leading-relaxed">{p.whoTheyAre}</p>
          </Section>

          <Section title="Your relationship">
            <p className="text-sm text-foreground/85 leading-relaxed">
              {p.relationshipContext}
            </p>
            <div className="mt-3 grid sm:grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-lg bg-cream/60 border border-border/60 px-3 py-2">
                <p className="uppercase tracking-wide text-muted-foreground">Stage</p>
                <p className="text-foreground">{p.stage}</p>
              </div>
              <div className="rounded-lg bg-cream/60 border border-border/60 px-3 py-2">
                <p className="uppercase tracking-wide text-muted-foreground">Status</p>
                <p className="text-foreground capitalize">{p.active}</p>
              </div>
            </div>
          </Section>

          <Section title="Recent / open threads">
            {p.threads.length === 0 ? (
              <p className="text-sm text-muted-foreground">No open threads.</p>
            ) : (
              <ul className="grid gap-2">
                {p.threads.map((t, i) => (
                  <li
                    key={i}
                    className="rounded-xl bg-cream/60 border border-border/60 px-3 py-2.5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{t.subject}</p>
                      <span
                        className={
                          "rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide " +
                          (t.needsReplyFrom === "you"
                            ? "bg-[oklch(0.94_0.05_25)] text-[oklch(0.4_0.12_25)] border-[oklch(0.88_0.06_25)]"
                            : "bg-cream text-muted-foreground border-border")
                        }
                      >
                        {t.needsReplyFrom === "you" ? "Needs your reply" : "Waiting for them"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{t.snippet}</p>
                    <p className="mt-2 text-xs text-foreground/80">
                      <span className="text-muted-foreground">Suggested:</span>{" "}
                      {t.suggestedNext}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Important context">
            {p.importantContext.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing tracked yet.</p>
            ) : (
              <dl className="grid sm:grid-cols-2 gap-2">
                {p.importantContext.map((c) => (
                  <div
                    key={c.label}
                    className="rounded-lg bg-cream/60 border border-border/60 px-3 py-2"
                  >
                    <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {c.label}
                    </dt>
                    <dd className="text-sm text-foreground">{c.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Section>

          <Section title="Uncertainties">
            {p.uncertainties.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Ivy is confident in what it knows.
              </p>
            ) : (
              <ul className="grid gap-1.5">
                {p.uncertainties.map((u, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
                    {u}
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Claims & sources">
            {p.claims.length === 0 ? (
              <p className="text-sm text-muted-foreground">No claims recorded.</p>
            ) : (
              <ul className="grid gap-2">
                {p.claims.map((c, i) => {
                  const Icon = sourceIcons[c.sourceType];
                  return (
                    <li
                      key={i}
                      className="rounded-xl bg-cream/60 border border-border/60 px-3 py-2.5"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border">
                          <Icon className="h-3 w-3 text-muted-foreground" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">{c.text}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                            <span className="capitalize">{c.sourceType}</span>
                            <span>·</span>
                            <span>{c.observedDate}</span>
                          </div>
                        </div>
                        <ConfidenceBadge level={c.confidence} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm text-foreground break-words">{value}</dd>
    </div>
  );
}
