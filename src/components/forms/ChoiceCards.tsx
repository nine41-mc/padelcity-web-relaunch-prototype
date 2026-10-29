"use client";

import { cn } from "../ui/cn";
import { FieldMessage } from "./Field";

export type Choice = { value: string; title: string; text?: string };

/**
 * Single choice as cards (Figma: Choice Card, State=Default/Selected) – a radio group with a visible legend.
 * Selected: brand-gradient border and filled radio. Controlled.
 */
export function ChoiceCards({
  name,
  legend,
  options,
  value,
  onChange,
  required,
  error,
  className,
}: {
  name: string;
  legend: string;
  options: Choice[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  className?: string;
}) {
  const msg = `${name}-msg`;
  return (
    <fieldset className={className} aria-describedby={error ? msg : undefined}>
      <legend className="mb-2 block text-sm font-medium text-white/85">
        {legend}
        {required && <span className="text-magenta-300"> *</span>}
      </legend>
      <div className="grid gap-3 md:grid-cols-3">
        {options.map((o) => (
          // the 1px padding shows the border: grey, the brand gradient when selected, red on an error
          <label
            key={o.value}
            className={cn(
              "group cursor-pointer rounded-[20px] p-px transition-colors has-checked:bg-brand-gradient has-focus-visible:ring-2 has-focus-visible:ring-optic-500/60",
              error ? "bg-danger" : "bg-white/10 hover:bg-white/35",
            )}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              required={required}
              className="sr-only"
            />
            <span className="flex h-full flex-col gap-3 rounded-[19px] bg-ink-700 pad-card">
              <span className="grid size-[22px] place-items-center rounded-full border border-white/25 group-has-checked:border-transparent group-has-checked:bg-brand-gradient" aria-hidden>
                <span className="size-2 rounded-full bg-white opacity-0 group-has-checked:opacity-100" />
              </span>
              <span className="text-lg font-semibold text-white">{o.title}</span>
              {o.text && <span className="text-sm text-white/85">{o.text}</span>}
            </span>
          </label>
        ))}
      </div>
      <FieldMessage id={msg} error={error} />
    </fieldset>
  );
}
