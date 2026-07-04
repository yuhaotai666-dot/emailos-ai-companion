export function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const active = i + 1 === current;
        const done = i + 1 < current;
        return (
          <span
            key={i}
            className={
              "h-1.5 rounded-full transition-all " +
              (active
                ? "w-6 bg-foreground"
                : done
                ? "w-1.5 bg-foreground/50"
                : "w-1.5 bg-border")
            }
          />
        );
      })}
    </div>
  );
}
