import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/workspace/Common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { useKnowledgeStore } from "@/lib/knowledge-store";

export const Route = createFileRoute("/_app/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge — Ivy" },
      { name: "description", content: "Ivy learns how you work, but you stay in control." },
    ],
  }),
  component: KnowledgePage,
});

function KnowledgePage() {
  const { bases, addBase, renameBase, deleteBase, addKnowledge, updateKnowledge, deleteKnowledge } =
    useKnowledgeStore();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editingBase, setEditingBase] = useState<string | null>(null);
  const [baseDraft, setBaseDraft] = useState("");
  const [addingKnowledgeFor, setAddingKnowledgeFor] = useState<string | null>(null);
  const [newKnowledgeTitle, setNewKnowledgeTitle] = useState("");
  const [editingKnowledge, setEditingKnowledge] = useState<string | null>(null);
  const [knowledgeTitleDraft, setKnowledgeTitleDraft] = useState("");
  const [knowledgeDetailDraft, setKnowledgeDetailDraft] = useState("");
  const [showNewBase, setShowNewBase] = useState(false);
  const [newBaseName, setNewBaseName] = useState("");

  const toggle = (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-10 py-10">
      <PageHeader title="Knowledge" subtitle="Ivy learns how you work, but you stay in control." />
      <p className="mb-6 text-xs text-muted-foreground">
        Each knowledge base groups knowledge Ivy follows. Click an entry to see or edit the details.
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
                        if (confirm(`Delete "${base.name}" and all its knowledge?`)) {
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
                {base.entries.map((entry) => {
                  const open = expanded[entry.id];
                  const isEditingK = editingKnowledge === entry.id;
                  return (
                    <li
                      key={entry.id}
                      className="rounded-xl bg-cream/60 border border-border/60"
                    >
                      <div className="px-3 py-2 flex items-start gap-2">
                        <button
                          onClick={() => toggle(entry.id)}
                          className="mt-0.5 text-muted-foreground hover:text-foreground"
                          aria-label="Toggle detail"
                        >
                          {open ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                        </button>
                        {isEditingK ? (
                          <Input
                            value={knowledgeTitleDraft}
                            onChange={(e) => setKnowledgeTitleDraft(e.target.value)}
                            className="flex-1 h-8 bg-background text-sm"
                          />
                        ) : (
                          <button
                            onClick={() => toggle(entry.id)}
                            className="flex-1 text-left text-sm text-foreground"
                          >
                            {entry.title}
                          </button>
                        )}
                        {!isEditingK && (
                          <>
                            <button
                              className="text-muted-foreground hover:text-foreground p-1"
                              onClick={() => {
                                setEditingKnowledge(entry.id);
                                setKnowledgeTitleDraft(entry.title);
                                setKnowledgeDetailDraft(entry.detail);
                                setExpanded((e) => ({ ...e, [entry.id]: true }));
                              }}
                              aria-label="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              className="text-muted-foreground hover:text-destructive p-1"
                              onClick={() => {
                                deleteKnowledge(base.id, entry.id);
                                toast("Knowledge deleted.");
                              }}
                              aria-label="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>

                      {(open || isEditingK) && (
                        <div className="px-3 pb-3 pl-9">
                          {isEditingK ? (
                            <>
                              <Textarea
                                value={knowledgeDetailDraft}
                                onChange={(e) => setKnowledgeDetailDraft(e.target.value)}
                                className="min-h-[100px] bg-background text-sm"
                                placeholder="Detailed requirements — when and how Ivy should apply this knowledge."
                              />
                              <div className="mt-2 flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    updateKnowledge(base.id, entry.id, {
                                      title: knowledgeTitleDraft.trim() || entry.title,
                                      detail: knowledgeDetailDraft,
                                    });
                                    setEditingKnowledge(null);
                                    toast.success("Knowledge updated.");
                                  }}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingKnowledge(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </>
                          ) : (
                            <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                              {entry.detail}
                            </p>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}

                {addingKnowledgeFor === base.id ? (
                  <li className="rounded-xl bg-background border border-border px-3 py-2 flex items-center gap-2">
                    <Input
                      value={newKnowledgeTitle}
                      onChange={(e) => setNewKnowledgeTitle(e.target.value)}
                      placeholder="Knowledge name, e.g. Always confirm publish window"
                      className="h-8 bg-background text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newKnowledgeTitle.trim()) {
                          addKnowledge(base.id, newKnowledgeTitle.trim());
                          setNewKnowledgeTitle("");
                          setAddingKnowledgeFor(null);
                          toast.success("Knowledge added.");
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        if (newKnowledgeTitle.trim()) {
                          addKnowledge(base.id, newKnowledgeTitle.trim());
                          setNewKnowledgeTitle("");
                          setAddingKnowledgeFor(null);
                          toast.success("Knowledge added.");
                        }
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setAddingKnowledgeFor(null);
                        setNewKnowledgeTitle("");
                      }}
                    >
                      Cancel
                    </Button>
                  </li>
                ) : (
                  <li>
                    <button
                      onClick={() => setAddingKnowledgeFor(base.id)}
                      className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add knowledge
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
