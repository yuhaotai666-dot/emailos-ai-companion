import { useState } from "react";
import { Check, Tag, X, Settings2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEventsStore, eventColorClasses } from "@/lib/events-store";
import { EventBadge } from "./EventBadge";

interface Props {
  emailId: string;
  onManage?: () => void;
}

export function EventLabelPicker({ emailId, onManage }: Props) {
  const events = useEventsStore((s) => s.events);
  const currentId = useEventsStore((s) => s.emailEventMap[emailId]);
  const setEmailEvent = useEventsStore((s) => s.setEmailEvent);
  const addEvent = useEventsStore((s) => s.addEvent);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const current = events.find((e) => e.id === currentId);
  const filtered = events.filter((e) => e.name.toLowerCase().includes(query.trim().toLowerCase()));
  const exact = events.some((e) => e.name.toLowerCase() === query.trim().toLowerCase());

  const trigger = current ? (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2 py-1 text-[11px] hover:bg-cream transition-colors"
    >
      <span className={`h-1.5 w-1.5 rounded-full ${eventColorClasses(current.color).dot}`} />
      <span className="max-w-[140px] truncate">{current.name}</span>
      <span
        role="button"
        aria-label="Clear event"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setEmailEvent(emailId, null);
        }}
        className="ml-0.5 text-muted-foreground hover:text-foreground"
      >
        <X className="h-3 w-3" />
      </span>
    </button>
  ) : (
    <Button variant="ghost" size="sm" className="rounded-full h-8 text-xs gap-1.5">
      <Tag className="h-3.5 w-3.5" />
      Add event
    </Button>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0">
        <div className="p-2 border-b border-border">
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or create event…"
            className="h-8 text-sm"
          />
        </div>
        <div className="max-h-64 overflow-y-auto py-1">
          {filtered.map((ev) => {
            const active = ev.id === currentId;
            return (
              <button
                key={ev.id}
                type="button"
                onClick={() => {
                  setEmailEvent(emailId, ev.id);
                  setOpen(false);
                  setQuery("");
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-cream text-left"
              >
                <EventBadge event={ev} />
                {active && <Check className="h-3.5 w-3.5 ml-auto text-foreground" />}
              </button>
            );
          })}
          {query.trim() && !exact && (
            <button
              type="button"
              onClick={() => {
                const ev = addEvent(query, "slate");
                setEmailEvent(emailId, ev.id);
                setOpen(false);
                setQuery("");
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-cream text-left border-t border-border/60 mt-1"
            >
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              Create <span className="font-medium">"{query.trim()}"</span>
            </button>
          )}
          {filtered.length === 0 && !query.trim() && (
            <p className="px-3 py-4 text-xs text-muted-foreground">No events yet. Type to create one.</p>
          )}
        </div>
        {onManage && (
          <div className="border-t border-border p-1">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onManage();
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-cream rounded-md"
            >
              <Settings2 className="h-3.5 w-3.5" />
              Manage events…
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
