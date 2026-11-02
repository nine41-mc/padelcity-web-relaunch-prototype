import { DoorOpen, SquareParking, TrainFront } from "lucide-react";
import type { Club } from "@/lib/data/types";
import { cn } from "../ui/cn";

type Labels = { parking: string; checkIn: string; transit: string };

// Contentful module: clubArrival – parking, check-in and public transport beside the map (team feedback ort-4).
// Each line only shows when the club has it filled; without any, the module is not rendered.
export function ClubArrival({ arrival, labels, className }: { arrival: NonNullable<Club["arrival"]>; labels: Labels; className?: string }) {
  const rows = [
    { key: "parking", icon: SquareParking, label: labels.parking, text: arrival.parking },
    { key: "checkIn", icon: DoorOpen, label: labels.checkIn, text: arrival.checkIn },
    { key: "transit", icon: TrainFront, label: labels.transit, text: arrival.transit },
  ].filter((r) => r.text);
  if (!rows.length) return null;
  return (
    <dl className={cn("grid gap-4 md:grid-cols-3", className)}>
      {rows.map(({ key, icon: Icon, label, text }) => (
        <div key={key} className="rounded-[20px] border border-fg/10 pad-card">
          <dt className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-fg/70">
            <Icon className="size-5 text-fg" aria-hidden /> {label}
          </dt>
          <dd className="mt-2 text-fg/85">{text}</dd>
        </div>
      ))}
    </dl>
  );
}
