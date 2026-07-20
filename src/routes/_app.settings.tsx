import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/workspace/Common";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Plus } from "lucide-react";
import { toast } from "sonner";
import { useRulesStore, useHydrateRules } from "@/lib/rules-store";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Ivy" },
      { name: "description", content: "Preferences, safety, and integrations for Ivy." },
    ],
  }),
  component: SettingsPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <h3 className="font-serif text-xl text-foreground mb-4">{title}</h3>
      <div className="grid gap-2">{children}</div>
    </section>
  );
}

function ToggleRow({
  label,
  desc,
  defaultChecked,
}: {
  label: string;
  desc?: string;
  defaultChecked?: boolean;
}) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <div className="flex items-center justify-between rounded-xl bg-cream/60 border border-border/60 px-3 py-2.5">
      <div>
        <p className="text-sm text-foreground">{label}</p>
        {desc ? <p className="text-xs text-muted-foreground">{desc}</p> : null}
      </div>
      <Switch checked={on} onCheckedChange={setOn} />
    </div>
  );
}

function SettingsPage() {
  const [tone, setTone] = useState("Professional");

  return (
    <div className="mx-auto max-w-3xl px-6 lg:px-10 py-10">
      <PageHeader title="Settings" subtitle="Preferences, safety, and integrations." />

      <div className="grid gap-4">
        <Section title="Gmail Connection">
          <div className="rounded-xl bg-cream/60 border border-border/60 px-3 py-3 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background border border-border">
              <Mail className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">theo@superintern.ai</p>
              <p className="text-xs text-muted-foreground">Connected · Primary</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs bg-background"
              onClick={() => toast("Coming soon")}
            >
              Manage
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-xs justify-start"
            onClick={() => toast("Coming soon")}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add another account
          </Button>
        </Section>

        <Section title="Agent Rules">
          <p className="text-xs text-muted-foreground -mt-2 mb-1">
            Rules that shape how Ivy behaves. Edit or add rules to steer the agent.
          </p>
          <RulesEditor />
        </Section>

        <Section title="AI Preferences">
          <div className="rounded-xl bg-cream/60 border border-border/60 px-3 py-2.5 flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Default tone</p>
              <p className="text-xs text-muted-foreground">Used for new drafts.</p>
            </div>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="h-8 w-36 rounded-full bg-background text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Concise", "Polite", "Direct", "Friendly", "Professional"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Section>

        <Section title="Email Categories">
          {["Need Reply", "Important", "FYI", "Meeting", "Payment", "Low Priority", "Product Access"].map(
            (c) => (
              <ToggleRow key={c} label={c} defaultChecked />
            ),
          )}
        </Section>

        <Section title="Safety Settings">
          <ToggleRow label="Never send emails automatically" defaultChecked />
          <ToggleRow label="Always require user approval" defaultChecked />
          <ToggleRow label="Do not process spam" defaultChecked />
          <ToggleRow label="Do not store full email body unless enabled" defaultChecked />
          <ToggleRow label="Require approval before creating Gmail drafts" defaultChecked />
        </Section>

        <Section title="Notifications">
          <ToggleRow label="Daily brief" defaultChecked />
          <ToggleRow label="Payment reminders" defaultChecked />
          <ToggleRow label="Follow-up reminders" defaultChecked />
          <ToggleRow label="Meeting summaries" />
        </Section>
      </div>
    </div>
  );
}

function RulesEditor() {
  useHydrateRules();
  const { text, setText } = useRulesStore();
  const [draft, setDraft] = useState(text);
  const [touched, setTouched] = useState(false);
  // Once the account rules load, seed the editor with them (until the user
  // starts typing).
  useEffect(() => {
    if (!touched) setDraft(text);
  }, [text, touched]);
  const dirty = draft !== text;

  return (
    <div className="grid gap-2">
      <Textarea
        value={draft}
        onChange={(e) => {
          setTouched(true);
          setDraft(e.target.value);
        }}
        rows={10}
        placeholder="Write rules to shape how Ivy behaves. One per line, or free-form."
        className="text-sm bg-background min-h-[220px]"
      />
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full text-xs"
          disabled={!dirty}
          onClick={() => setDraft(text)}
        >
          Reset
        </Button>
        <Button
          size="sm"
          className="rounded-full text-xs"
          disabled={!dirty}
          onClick={() => {
            setText(draft);
            setTouched(false);
            toast.success("Rules saved");
          }}
        >
          Save rules
        </Button>
      </div>
    </div>
  );
}
