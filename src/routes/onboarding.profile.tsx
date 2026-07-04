import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { OnboardingCard } from "@/components/onboarding/OnboardingCard";
import { useOnboarding } from "@/lib/onboarding-store";
import { mockUser } from "@/lib/mock-data";

export const Route = createFileRoute("/onboarding/profile")({
  component: ProfileStep,
});

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{title}</p>
      <ul className="mt-2 grid gap-1.5">
        {items.map((i) => (
          <li key={i} className="text-sm text-foreground">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

const contacts = [
  { role: "Creator partner", name: "Krishna Patel" },
  { role: "Internal team member", name: "Ana Rivera" },
  { role: "Payment / finance contact", name: "Finance @ SuperIntern" },
  { role: "Product access contact", name: "Max Herrera" },
];

function ProfileStep() {
  const nav = useNavigate();
  const { finish } = useOnboarding();

  return (
    <OnboardingCard
      step={5}
      title="Here's what we know about you."
      subtitle="A quick summary Ivy built from your inbox and calendar. You can edit this later."
      primaryLabel="Finish setup"
      onPrimary={() => {
        finish();
        nav({ to: "/home" });
      }}
    >
      <div className="rounded-2xl border border-border bg-cream/60 p-5">
        <Section
          title="Professional identity"
          items={[
            `Role: ${mockUser.role}`,
            "Main work: Creator partnerships, influencer outreach, payments, product access, video reviews, collaboration negotiations",
          ]}
        />
        <div className="my-4 h-px bg-border" />
        <Section
          title="Communication style"
          items={[
            "Concise and action-oriented",
            "Polite but direct",
            "Appreciative before getting to the point",
            "Professional tone for external communication",
          ]}
        />
        <div className="my-4 h-px bg-border" />
        <Section
          title="Likely priorities"
          items={[
            "Creator video reviews",
            "Payment follow-ups",
            "Tracking links and referral codes",
            "Product access issues",
            "Meeting scheduling",
            "Partnership negotiation",
          ]}
        />
        <div className="my-4 h-px bg-border" />
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Key contacts sample</p>
          <div className="mt-2 grid sm:grid-cols-2 gap-2">
            {contacts.map((c) => (
              <div key={c.role} className="rounded-xl bg-background border border-border px-3 py-2">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{c.role}</p>
                <p className="text-sm text-foreground mt-0.5">{c.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">You can edit this later.</p>
    </OnboardingCard>
  );
}
