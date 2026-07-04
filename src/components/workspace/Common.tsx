import type { ReactNode } from "react";

export function TrustBanner({ children }: { children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-cream/70 px-4 py-2.5 text-xs text-muted-foreground flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children ?? "AI drafts. You approve. Ivy never sends without your confirmation."}
    </div>
  );
}

export function EmptyState({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-cream/40 px-6 py-10 text-center">
      <p className="font-serif text-xl text-foreground">{title}</p>
      {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
