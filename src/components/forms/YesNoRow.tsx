"use client";

import { cn } from "../ui/cn";
import { sheetChip } from "../locations/FilterSheet";

/**
 * Option with a yes/no choice (Figma: Add-on Row, Wert=Nein/Ja): title and text left, two Filter Chips as radios
 * right. Stack several in a bordered list (`divide-y`). Controlled.
 */
export function YesNoRow({
  name,
  title,
  text,
  value,
  onChange,
  yes,
  no,
}: {
  name: string;
  title: string;
  text?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  yes: string;
  no: string;
}) {
  const titleId = `${name}-title`;
  return (
    <div role="radiogroup" aria-labelledby={titleId} className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="min-w-0">
        <p id={titleId} className="font-medium text-white">
          {title}
        </p>
        {text && <p className="mt-1 text-sm text-white/85">{text}</p>}
      </div>
      <div className="flex shrink-0 gap-2">
        {[
          { v: true, label: yes },
          { v: false, label: no },
        ].map(({ v, label }) => (
          <label key={label} className={cn(sheetChip(value === v), "cursor-pointer has-focus-visible:ring-2 has-focus-visible:ring-optic-500/60")}>
            <input type="radio" name={name} value={v ? "yes" : "no"} checked={value === v} onChange={() => onChange(v)} className="sr-only" />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
}
