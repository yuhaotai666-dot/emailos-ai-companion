import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { OnboardingCard } from "@/components/onboarding/OnboardingCard";
import { useOnboarding } from "@/lib/onboarding-store";
import { Brain, Inbox, PenLine, ShieldCheck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/onboarding/")({
  component: WelcomeStep,
});

const points = [
  { icon: Brain, text: "Learns your email and calendar context" },
  { icon: Inbox, text: "Finds messages that need your attention" },
  { icon: PenLine, text: "Drafts replies for you to review" },
  { icon: ShieldCheck, text: "Never sends without your approval" },
];

function WelcomeStep() {
  const nav = useNavigate();
  const { timezone, theme, setField } = useOnboarding();

  return (
    <OnboardingCard
      step={1}
      hideBack
      title="Let's get your inbox organized."
      subtitle="EmailOS AI learns from your inbox, drafts replies, and helps you stay on top of what matters."
      primaryLabel="Let's get started"
      onPrimary={() => nav({ to: "/onboarding/connect" })}
    >
      <ul className="grid gap-3">
        {points.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 rounded-2xl border border-border bg-cream/60 px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background border border-border text-foreground/80">
              <Icon className="h-4 w-4" />
            </span>
            <span className="text-sm text-foreground">{text}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Time zone</Label>
          <Select value={timezone} onValueChange={(v) => setField("timezone", v)}>
            <SelectTrigger className="mt-1.5 rounded-xl bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="America/Los_Angeles">Pacific — Los Angeles</SelectItem>
              <SelectItem value="America/New_York">Eastern — New York</SelectItem>
              <SelectItem value="Europe/London">GMT — London</SelectItem>
              <SelectItem value="Europe/Berlin">CET — Berlin</SelectItem>
              <SelectItem value="Asia/Singapore">SGT — Singapore</SelectItem>
              <SelectItem value="Asia/Tokyo">JST — Tokyo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Theme</Label>
          <Select value={theme} onValueChange={(v) => setField("theme", v as "system" | "light" | "dark")}>
            <SelectTrigger className="mt-1.5 rounded-xl bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground flex items-center gap-2">
        <ShieldCheck className="h-3.5 w-3.5" />
        EmailOS AI never sends emails without your confirmation.
      </p>
    </OnboardingCard>
  );
}
