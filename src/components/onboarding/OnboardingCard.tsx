import { ArrowLeft } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { StepDots } from "./StepDots";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface OnboardingCardProps {
  step: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  onSkip?: () => void;
  skipLabel?: string;
  hideBack?: boolean;
}

export function OnboardingCard({
  step,
  totalSteps = 5,
  title,
  subtitle,
  children,
  primaryLabel,
  onPrimary,
  primaryDisabled,
  onSkip,
  skipLabel = "Skip for now",
  hideBack,
}: OnboardingCardProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
          <div className="flex items-center justify-between px-8 pt-6">
            {!hideBack ? (
              <button
                onClick={() => router.history.back()}
                className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <div className="h-8 w-8" />
            )}
            <StepDots current={step} total={totalSteps} />
            <div className="h-8 w-8" />
          </div>

          <div className="px-8 sm:px-12 pt-8 pb-2">
            <h1 className="font-serif text-4xl sm:text-5xl text-foreground leading-tight">{title}</h1>
            {subtitle ? (
              <p className="mt-3 text-base text-muted-foreground max-w-lg">{subtitle}</p>
            ) : null}
          </div>

          <div className="px-8 sm:px-12 py-6">{children}</div>

          <div className="border-t border-border bg-cream/50 px-8 sm:px-12 py-5 flex items-center justify-between gap-3">
            <div>
              {onSkip ? (
                <button
                  onClick={onSkip}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {skipLabel}
                </button>
              ) : null}
            </div>
            <Button
              onClick={onPrimary}
              disabled={primaryDisabled}
              className="rounded-full px-6 h-10 bg-primary text-primary-foreground hover:opacity-90"
            >
              {primaryLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
