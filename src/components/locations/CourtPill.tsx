import { AppIcon } from "../ui/Icon";

/** Court count by type (Figma: Court Pill) – "5 Outdoor Double" with the court icon; hugs its label. */
export function CourtPill({ courtType, label }: { courtType: string; label: string }) {
  return (
    <span className="flex items-center gap-3 rounded-2xl border border-fg/10 bg-canvas/60 py-4 pl-4 pr-5">
      <AppIcon name={`${courtType}_court`} className="size-6 shrink-0 text-fg" />
      <span className="font-medium leading-tight">{label}</span>
    </span>
  );
}
