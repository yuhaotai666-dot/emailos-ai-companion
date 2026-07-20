import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/workspace/Common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { useMemoryStore } from "@/lib/memory-store";

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
  const { bases, addBase, renameBase, deleteBase, addRule, updateRule, deleteRule } =
    useMemoryStore();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editingBase, setEditingBase] = useState<string | null>(null);
  const [baseDraft, setBaseDraft] = useState("");
  const [addingRuleFor, setAddingRuleFor] = useState<string | null>(null);
  const [newRuleTitle, setNewRuleTitle] = useState("");
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [ruleTitleDraft, setRuleTitleDraft] = useState("");
  const [ruleDetailDraft, setRuleDetailDraft] = useState("");
  const [showNewBase, setShowNewBase] = useState(false);
  const [newBaseName, setNewBaseName] = useState("");

  const toggle = (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-10 py-10">
      <PageHeader title="Memory" subtitle="Ivy learns how you work, but you stay in control." />
      <p className="mb-6 text-xs text-muted-foreground">
        Each knowledge base groups rules Ivy follows. Click a rule to see or edit the details.
      </p>

      <div className="grid gap-4">
        {bases.map((base) => {
          const isEditingName = editingBase === base.id;
          return (
            <section
              key={base.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <>
                    <Input
                      value={baseDraft}
                      onChange={(e) => setBaseDraft(e.target.value)}
                      className="h-8 max-w-xs bg-background text-base"
                      autoFocus
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => {
                        if (baseDraft.trim()) {
                          renameBase(base.id, baseDraft.trim());
                          toast.success("Knowledge base renamed.");
                        }
                        setEditingBase(null);
                      }}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => setEditingBase(null)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="font-serif text-xl text-foreground flex-1">{base.name}</h3>
                    <button
                      className="text-muted-foreground hover:text-foreground p-1"
                      onClick={() => {
                        setEditingBase(base.id);
                        setBaseDraft(base.name);
                      }}
                      aria-label="Rename base"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      className="text-muted-foreground hover:text-destructive p-1"
                      onClick={() => {
                        if (confirm(`Delete "${base.name}" and all its rules?`)) {
                          deleteBase(base.id);
                          toast("Knowledge base deleted.");
                        }
                      }}
                      aria-label="Delete base"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>

              <ul className="mt-3 grid gap-2">
                {base.rules.map((rule) => {
                  const open = expanded[rule.id];
                  const isEditingR = editingRule === rule.id;
                  return (
                    <li
                      key={rule.id}
                      className="rounded-xl bg-cream/60 border border-border/60"
                    >
                      <div className="px-3 py-2 flex items-start gap-2">
                        <button
                          onClick={() => toggle(rule.id)}
                          className="mt-0.5 text-muted-foreground hover:text-foreground"
                          aria-label="Toggle detail"
                        >
                          {open ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                        </button>
                        {isEditingR ? (
                          <Input
                            value={ruleTitleDraft}
                            onChange={(e) => setRuleTitleDraft(e.target.value)}
                            className="flex-1 h-8 bg-background text-sm"
                          />
                        ) : (
                          <button
                            onClick={() => toggle(rule.id)}
                            className="flex-1 text-left text-sm text-foreground"
                          >
                            {rule.title}
                          </button>
                        )}
                        {!isEditingR && (
                          <>
                            <button
                              className="text-muted-foreground hover:text-foreground p-1"
                              onClick={() => {
                                setEditingRule(rule.id);
                                setRuleTitleDraft(rule.title);
                                setRuleDetailDraft(rule.detail);
                                setExpanded((e) => ({ ...e, [rule.id]: true }));
                              }}
                              aria-label="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              className="text-muted-foreground hover:text-destructive p-1"
                              onClick={() => {
                                deleteRule(base.id, rule.id);
                                toast("Rule deleted.");
                              }}
                              aria-label="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>

                      {(open || isEditingR) && (
                        <div className="px-3 pb-3 pl-9">
                          {isEditingR ? (
                            <>
                              <Textarea
                                value={ruleDetailDraft}
                                onChange={(e) => setRuleDetailDraft(e.target.value)}
                                className="min-h-[100px] bg-background text-sm"
                                placeholder="Detailed requirements — when and how Ivy should apply this rule."
                              />
                              <div className="mt-2 flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    updateRule(base.id, rule.id, {
                                      title: ruleTitleDraft.trim() || rule.title,
                                      detail: ruleDetailDraft,
                                    });
                                    setEditingRule(null);
                                    toast.success("Rule updated.");
                                  }}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingRule(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </>
                          ) : (
                            <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                              {rule.detail}
                            </p>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}

                {addingRuleFor === base.id ? (
                  <li className="rounded-xl bg-background border border-border px-3 py-2 flex items-center gap-2">
                    <Input
                      value={newRuleTitle}
                      onChange={(e) => setNewRuleTitle(e.target.value)}
                      placeholder="Rule name, e.g. Always confirm publish window"
                      className="h-8 bg-background text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newRuleTitle.trim()) {
                          addRule(base.id, newRuleTitle.trim());
                          setNewRuleTitle("");
                          setAddingRuleFor(null);
                          toast.success("Rule added.");
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        if (newRuleTitle.trim()) {
                          addRule(base.id, newRuleTitle.trim());
                          setNewRuleTitle("");
                          setAddingRuleFor(null);
                          toast.success("Rule added.");
                        }
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setAddingRuleFor(null);
                        setNewRuleTitle("");
                      }}
                    >
                      Cancel
                    </Button>
                  </li>
                ) : (
                  <li>
                    <button
                      onClick={() => setAddingRuleFor(base.id)}
                      className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add rule
                    </button>
                  </li>
                )}
              </ul>
            </section>
          );
        })}

        {showNewBase ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/60 p-4 flex items-center gap-2">
            <Input
              value={newBaseName}
              onChange={(e) => setNewBaseName(e.target.value)}
              placeholder="Knowledge base name, e.g. Meeting etiquette"
              className="h-9 bg-background"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && newBaseName.trim()) {
                  addBase(newBaseName.trim());
                  setNewBaseName("");
                  setShowNewBase(false);
                  toast.success("Knowledge base added.");
                }
              }}
            />
            <Button
              onClick={() => {
                if (newBaseName.trim()) {
                  addBase(newBaseName.trim());
                  setNewBaseName("");
                  setShowNewBase(false);
                  toast.success("Knowledge base added.");
                }
              }}
            >
              Add
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowNewBase(false);
                setNewBaseName("");
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setShowNewBase(true)}
            className="rounded-2xl border border-dashed border-border bg-card/40 hover:bg-card/70 p-4 text-sm text-muted-foreground hover:text-foreground inline-flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add knowledge base
          </button>
        )}
      </div>
    </div>
  );
}
