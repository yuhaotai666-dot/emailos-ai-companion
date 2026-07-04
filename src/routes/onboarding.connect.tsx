import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { OnboardingCard } from "@/components/onboarding/OnboardingCard";
import { useOnboarding } from "@/lib/onboarding-store";
import { Button } from "@/components/ui/button";
import { Check, Plus, Mail, Calendar, MessageSquare, Phone, Send } from "lucide-react";

export const Route = createFileRoute("/onboarding/connect")({
  component: ConnectStep,
});

const apps = [
  { id: "gmail", name: "Gmail", desc: "Read recent emails and prepare reply drafts", icon: Mail },
  { id: "calendar", name: "Google Calendar", desc: "Understand meetings and follow-up timing", icon: Calendar },
  { id: "slack", name: "Slack", desc: "Bring work messages into your assistant", icon: MessageSquare },
  { id: "whatsapp", name: "WhatsApp", desc: "Message your assistant from WhatsApp", icon: Phone },
  { id: "telegram", name: "Telegram", desc: "Message your assistant from Telegram", icon: Send },
];

function ConnectStep() {
  const nav = useNavigate();
  const { connections, toggleConnection } = useOnboarding();

  return (
    <OnboardingCard
      step={2}
      title="Supercharge your assistant."
      subtitle="Connect your email and work apps so Ivy can help you more. Everything is optional."
      primaryLabel="Continue"
      onPrimary={() => nav({ to: "/onboarding/assistant" })}
      onSkip={() => nav({ to: "/onboarding/assistant" })}
    >
      <div className="rounded-2xl border border-border bg-cream/60 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border text-sm font-medium">
            T
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground truncate">theo@superintern.ai</p>
              <span className="rounded-full bg-background border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                Primary
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-[11px]">Gmail · Calendar · Drive · Docs</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="rounded-full text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add account
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {apps.map(({ id, name, desc, icon: Icon }) => {
          const connected = !!connections[id];
          return (
            <div
              key={id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream border border-border">
                <Icon className="h-4 w-4 text-foreground/80" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground truncate">{desc}</p>
              </div>
              <Button
                variant={connected ? "outline" : "default"}
                size="sm"
                onClick={() => toggleConnection(id)}
                className={
                  "rounded-full text-xs h-8 " +
                  (connected ? "bg-background" : "bg-primary text-primary-foreground")
                }
              >
                {connected ? (
                  <>
                    <Check className="h-3.5 w-3.5 mr-1" /> Connected
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </OnboardingCard>
  );
}
