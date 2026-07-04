import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { OnboardingCard } from "@/components/onboarding/OnboardingCard";
import { useOnboarding } from "@/lib/onboarding-store";
import { Switch } from "@/components/ui/switch";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/onboarding/routines")({
  component: RoutinesStep,
});

const routines = [
  {
    id: "auto-inbox",
    title: "Auto-inbox",
    desc: "Your inbox, organized without the work.",
    warning:
      "Drafts are never sent automatically. You review and approve before anything is sent.",
    options: [
      { id: "label", label: "Label new mail" },
      { id: "detect", label: "Detect emails that need replies" },
      { id: "draft", label: "Draft replies to important emails" },
      { id: "archive", label: "Archive low-priority emails" },
      { id: "schedule", label: "Assist with scheduling" },
    ],
  },
  {
    id: "morning-briefing",
    title: "Morning Briefing",
    desc: "Start your day knowing exactly what matters.",
    options: [
      { id: "priority", label: "Summarize priority emails" },
      { id: "meetings", label: "Highlight meetings today" },
      { id: "overdue", label: "Show overdue follow-ups" },
      { id: "actions", label: "Suggest top actions" },
    ],
  },
  {
    id: "meeting-briefing",
    title: "Meeting Briefing",
    desc: "Prepare before meetings and summarize what happens after.",
    options: [
      { id: "prep", label: "Meeting prep" },
      { id: "summary", label: "Meeting summary" },
      { id: "actions", label: "Action items" },
      { id: "followup", label: "Follow-up email draft" },
    ],
  },
  {
    id: "follow-up-watcher",
    title: "Follow-up Watcher",
    desc: "Never lose track of promises or pending replies.",
    options: [
      { id: "detect", label: "Detect follow-up commitments" },
      { id: "remind", label: "Remind when someone has not replied" },
      { id: "suggest", label: "Suggest follow-up messages" },
    ],
  },
];

function RoutinesStep() {
  const nav = useNavigate();
  const { routines: state, toggleRoutineOption } = useOnboarding();

  return (
    <OnboardingCard
      step={4}
      title="Routines to get you started."
      subtitle="Turn on the workflows you want running in the background. You can change these later."
      primaryLabel="Continue"
      onPrimary={() => nav({ to: "/onboarding/profile" })}
    >
      <div className="grid gap-4">
        {routines.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border bg-background p-5">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl text-foreground">{r.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{r.desc}</p>
              </div>
            </div>

            <ul className="mt-4 grid gap-2">
              {r.options.map((o) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between rounded-xl bg-cream/60 border border-border/60 px-3 py-2"
                >
                  <span className="text-sm text-foreground">{o.label}</span>
                  <Switch
                    checked={!!state[r.id]?.[o.id]}
                    onCheckedChange={() => toggleRoutineOption(r.id, o.id)}
                  />
                </li>
              ))}
            </ul>

            {r.warning ? (
              <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
                <ShieldAlert className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                {r.warning}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </OnboardingCard>
  );
}
