import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEventsStore, EVENT_COLORS, eventColorClasses, type EventColor } from "@/lib/events-store";

function ColorSwatch({
  color,
  active,
  onClick,
}: {
  color: EventColor;
  active?: boolean;
  onClick: () => void;
}) {
  const c = eventColorClasses(color);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={color}
      className={`h-5 w-5 rounded-full ${c.dot} ring-offset-2 ring-offset-background transition ${
        active ? "ring-2 ring-foreground" : "hover:opacity-80"
      }`}
    />
  );
}

export function ManageEventsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const events = useEventsStore((s) => s.events);
  const addEvent = useEventsStore((s) => s.addEvent);
  const renameEvent = useEventsStore((s) => s.renameEvent);
  const recolorEvent = useEventsStore((s) => s.recolorEvent);
  const deleteEvent = useEventsStore((s) => s.deleteEvent);

  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState<EventColor>("slate");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage events</DialogTitle>
          <DialogDescription>
            Events are labels you tag emails with. Each email can belong to one event.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-2 py-1.5"
            >
              <div className="flex items-center gap-1">
                {EVENT_COLORS.map((c) => (
                  <ColorSwatch
                    key={c}
                    color={c}
                    active={ev.color === c}
                    onClick={() => recolorEvent(ev.id, c)}
                  />
                ))}
              </div>
              <Input
                value={ev.name}
                onChange={(e) => renameEvent(ev.id, e.target.value)}
                className="h-8 text-sm flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => {
                  if (confirm(`Delete "${ev.name}"? Emails tagged with it will be untagged.`)) {
                    deleteEvent(ev.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">No events yet.</p>
          )}
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">New event</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {EVENT_COLORS.map((c) => (
                <ColorSwatch key={c} color={c} active={newColor === c} onClick={() => setNewColor(c)} />
              ))}
            </div>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Event name"
              className="h-8 text-sm flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && newName.trim()) {
                  addEvent(newName, newColor);
                  setNewName("");
                }
              }}
            />
            <Button
              size="sm"
              disabled={!newName.trim()}
              onClick={() => {
                addEvent(newName, newColor);
                setNewName("");
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
