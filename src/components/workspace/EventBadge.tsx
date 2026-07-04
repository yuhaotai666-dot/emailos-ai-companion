import { eventColorClasses, type EventItem } from "@/lib/events-store";

export function EventDot({ color }: { color: EventItem["color"] }) {
  const c = eventColorClasses(color);
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${c.dot}`} />;
}

export function EventBadge({ event, size = "sm" }: { event: EventItem; size?: "sm" | "md" }) {
  const c = eventColorClasses(event.color);
  const sizing =
    size === "md" ? "text-xs px-2.5 py-1 gap-1.5" : "text-[11px] px-2 py-0.5 gap-1.5";
  return (
    <span
      className={`inline-flex items-center rounded-full border ${c.pill} ${sizing}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      <span className="truncate max-w-[140px]">{event.name}</span>
    </span>
  );
}
