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

const relationshipStyles: Record<RelationshipType, string> = {
  "Creator Partner": "bg-[oklch(0.95_0.04_290)] text-[oklch(0.4_0.1_290)] border-[oklch(0.88_0.05_290)]",
  "Influencer": "bg-[oklch(0.95_0.04_320)] text-[oklch(0.4_0.1_320)] border-[oklch(0.88_0.05_320)]",
  "Internal Team": "bg-[oklch(0.95_0.03_150)] text-[oklch(0.4_0.08_150)] border-[oklch(0.88_0.04_150)]",
  "Finance": "bg-[oklch(0.95_0.03_75)] text-[oklch(0.4_0.06_75)] border-[oklch(0.88_0.04_75)]",
  "Product Access": "bg-[oklch(0.95_0.03_220)] text-[oklch(0.4_0.08_220)] border-[oklch(0.88_0.04_220)]",
  "Sales Lead": "bg-[oklch(0.95_0.04_260)] text-[oklch(0.4_0.1_260)] border-[oklch(0.88_0.05_260)]",
  "Customer": "bg-cream text-foreground border-border",
  "Personal": "bg-cream text-muted-foreground border-border",
};

export function RelationshipBadge({ type }: { type: RelationshipType }) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide " +
        relationshipStyles[type]
      }
    >
      {type}
    </span>
  );
}

const statusStyles: Record<PersonStatus, string> = {
  "Needs reply": "bg-[oklch(0.94_0.05_25)] text-[oklch(0.4_0.12_25)] border-[oklch(0.88_0.06_25)]",
  "Waiting for them": "bg-cream text-muted-foreground border-border",
  "Waiting for payment": "bg-[oklch(0.95_0.05_75)] text-[oklch(0.4_0.1_75)] border-[oklch(0.88_0.06_75)]",
  "Video in review": "bg-[oklch(0.95_0.04_220)] text-[oklch(0.4_0.1_220)] border-[oklch(0.88_0.05_220)]",
  "Access issue": "bg-[oklch(0.94_0.05_15)] text-[oklch(0.4_0.12_15)] border-[oklch(0.88_0.06_15)]",
  "Active collaboration": "bg-[oklch(0.95_0.04_150)] text-[oklch(0.38_0.1_150)] border-[oklch(0.88_0.05_150)]",
  "Paused": "bg-cream text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: PersonStatus }) {
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide " +
        statusStyles[status]
      }
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

const confidenceStyles: Record<Confidence, string> = {
  high: "bg-[oklch(0.95_0.04_150)] text-[oklch(0.38_0.1_150)] border-[oklch(0.88_0.05_150)]",
  medium: "bg-[oklch(0.95_0.03_75)] text-[oklch(0.4_0.06_75)] border-[oklch(0.88_0.04_75)]",
  low: "bg-cream text-muted-foreground border-border",
};

export function ConfidenceBadge({ level }: { level: Confidence }) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide " +
        confidenceStyles[level]
      }
    >
      {level}
    </span>
  );
}
