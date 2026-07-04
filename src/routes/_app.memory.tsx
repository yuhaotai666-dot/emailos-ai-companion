import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMemoryProfile } from "@/lib/api/queries";
import { PageHeader } from "@/components/workspace/Common";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/memory")({
  head: () => ({
    meta: [
      { title: "Memory — Ivy" },
      { name: "description", content: "Ivy learns how you work, but you stay in control." },
    ],
  }),
  component: MemoryPage,
});

function MemoryPage() {
  const { data: loadedMemory } = useMemoryProfile();
  const [memory, setMemory] = useState<Record<string, string[]>>({});
  const [editing, setEditing] = useState<{ section: string; idx: number } | null>(null);
  const [draftText, setDraftText] = useState("");

  // Local edits layer on top of what the backend knows; refresh replaces both.
  useEffect(() => {
    if (loadedMemory) setMemory(loadedMemory);
  }, [loadedMemory]);

  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-10 py-10">
      <PageHeader title="Memory" subtitle="Ivy learns how you work, but you stay in control." />
      <p className="mb-6 text-xs text-muted-foreground">
        You can delete or edit anything Ivy remembers.
      </p>

      <div className="grid gap-4">
        {Object.entries(memory).map(([section, items]) => (
          <section
            key={section}
            className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
          >
            <h3 className="font-serif text-xl text-foreground">{section}</h3>
            <ul className="mt-3 grid gap-2">
              {items.map((item, idx) => {
                const isEditing = editing?.section === section && editing.idx === idx;
                return (
                  <li
                    key={idx}
                    className="rounded-xl bg-cream/60 border border-border/60 px-3 py-2 flex items-start gap-2"
                  >
                    {isEditing ? (
                      <>
                        <Textarea
                          value={draftText}
                          onChange={(e) => setDraftText(e.target.value)}
                          className="flex-1 min-h-[60px] rounded-lg bg-background text-sm"
                        />
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {
                              setMemory((m) => ({
                                ...m,
                                [section]: m[section].map((x, i) => (i === idx ? draftText : x)),
                              }));
                              setEditing(null);
                              toast.success("Memory updated.");
                            }}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setEditing(null)}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="flex-1 text-sm text-foreground">{item}</p>
                        <button
                          className="text-muted-foreground hover:text-foreground p-1"
                          onClick={() => {
                            setEditing({ section, idx });
                            setDraftText(item);
                          }}
                          aria-label="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          className="text-muted-foreground hover:text-destructive p-1"
                          onClick={() => {
                            setMemory((m) => ({
                              ...m,
                              [section]: m[section].filter((_, i) => i !== idx),
                            }));
                            toast("Memory deleted.");
                          }}
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
