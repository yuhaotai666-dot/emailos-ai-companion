import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { OnboardingCard } from "@/components/onboarding/OnboardingCard";
import { useOnboarding } from "@/lib/onboarding-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/onboarding/assistant")({
  component: AssistantStep,
});

const personas = [
  { id: "professional", label: "Professional assistant", tone: "bg-[oklch(0.92_0.02_60)]" },
  { id: "calm", label: "Calm assistant", tone: "bg-[oklch(0.92_0.03_220)]" },
  { id: "direct", label: "Direct assistant", tone: "bg-[oklch(0.9_0.02_40)]" },
  { id: "friendly", label: "Friendly assistant", tone: "bg-[oklch(0.92_0.04_100)]" },
  { id: "founder", label: "Founder assistant", tone: "bg-[oklch(0.9_0.03_20)]" },
  { id: "operator", label: "Operator assistant", tone: "bg-[oklch(0.92_0.03_280)]" },
];

const personalities = ["Professional", "Friendly", "Direct", "Concise", "Warm", "Executive"];

function AssistantStep() {
  const nav = useNavigate();
  const { assistantName, persona, personality, setField } = useOnboarding();

  return (
    <OnboardingCard
      step={3}
      title="Give your assistant a name."
      subtitle="Choose how your assistant should feel when helping you."
      primaryLabel="Confirm assistant"
      onPrimary={() => nav({ to: "/onboarding/routines" })}
    >
      <div className="rounded-2xl border border-border bg-cream/60 p-5 flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-background border border-border flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-accent" />
        </div>
        <div className="flex-1">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
            Assistant name
          </Label>
          <Input
            value={assistantName}
            onChange={(e) => setField("assistantName", e.target.value)}
            className="mt-1 bg-background rounded-xl border-border"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            {assistantName.toLowerCase().replace(/\s+/g, "")}@emailos.ai
          </p>
        </div>
      </div>

      <div className="mt-6">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Persona</Label>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {personas.map((p) => {
            const active = persona === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setField("persona", p.id)}
                className={
                  "flex flex-col items-center gap-2 rounded-2xl border p-3 text-left transition-colors " +
                  (active
                    ? "border-foreground bg-background"
                    : "border-border bg-background hover:bg-cream")
                }
              >
                <span className={"h-10 w-10 rounded-full border border-border " + p.tone} />
                <span className="text-xs text-foreground text-center">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Personality</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {personalities.map((p) => {
            const active = personality === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setField("personality", p)}
                className={
                  "rounded-full border px-3.5 py-1.5 text-xs transition-colors " +
                  (active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-foreground hover:bg-cream")
                }
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>
    </OnboardingCard>
  );
}
