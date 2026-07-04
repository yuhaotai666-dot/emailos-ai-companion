import type { Priority, Category, RelationshipType, PersonStatus, Confidence } from "@/lib/mock-data";

const priorityStyles: Record<Priority, string> = {
  high: "bg-[oklch(0.94_0.05_25)] text-[oklch(0.4_0.12_25)] border-[oklch(0.88_0.06_25)]",
  medium: "bg-[oklch(0.95_0.03_75)] text-[oklch(0.4_0.06_75)] border-[oklch(0.88_0.04_75)]",
  low: "bg-cream text-muted-foreground border-border",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide " +
        priorityStyles[priority]
      }
    >
      {priority}
    </span>
  );
}

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-cream px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
      {category}
    </span>
  );
}
