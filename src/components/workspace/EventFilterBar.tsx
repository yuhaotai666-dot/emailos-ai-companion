import { Plus } from "lucide-react";
import { useEventsStore, eventColorClasses } from "@/lib/events-store";

interface Props {
  value: string | "all";
  onChange: (v: string | "all") => void;
  counts: Record<string, number>;
  totalCount: number;
  onManage: () => void;
}

export function EventFilterBar({ value, onChange, counts, totalCount, onManage }: Props) {
  const events = useEventsStore((s) => s.events);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button
        onClick={() => onChange("all")}
        className={
          "rounded-full border px-3 py-1 text-xs transition-colors " +
          (value === "all"
            ? "border-foreground bg-foreground text-background"
            : "border-border bg-background text-foreground hover:bg-cream")
        }
      >
        All events
        <span className="ml-1.5 opacity-70">{totalCount}</span>
      </button>
      {events.map((ev) => {
        const active = value === ev.id;
        const c = eventColorClasses(ev.color);
        return (
          <button
            key={ev.id}
            onClick={() => onChange(ev.id)}
            className={
              "rounded-full border px-3 py-1 text-xs inline-flex items-center gap-1.5 transition-colors " +
              (active ? c.chipActive : `bg-background ${c.chip}`)
            }
          >
            <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
            {ev.name}
            <span className="opacity-70">{counts[ev.id] ?? 0}</span>
          </button>
        );
      })}
      <button
        onClick={onManage}
        className="rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-cream inline-flex items-center gap-1"
      >
        <Plus className="h-3 w-3" />
        New event
      </button>
    </div>
  );
}
