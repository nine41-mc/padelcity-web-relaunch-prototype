"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "./cn";

export type SelectOption = { value: string; label: string; count?: number; disabled?: boolean };

/**
 * Branded single-select (replaces the native OS dropdown).
 * ARIA "select-only combobox" pattern: button + listbox, full keyboard support
 * (↑/↓, Home/End, Enter/Space, Esc, Tab, type-ahead). With `name` it also posts in forms.
 */
export function Select({
  value,
  onChange,
  options,
  label,
  placeholder,
  icon,
  name,
  required,
  id,
  size = "md",
  invalid,
  describedBy,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** Accessible name (visually hidden unless you render your own <label htmlFor={id}>). */
  label: string;
  placeholder?: string;
  icon?: React.ReactNode;
  name?: string;
  required?: boolean;
  id?: string;
  size?: "md" | "lg";
  /** Error state for forms that validate themselves: red border and aria-invalid. */
  invalid?: boolean;
  /** id of a hint or error text below the select */
  describedBy?: string;
  className?: string;
}) {
  const autoId = useId();
  const baseId = id ?? autoId;
  const listId = `${baseId}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, options.findIndex((o) => o.value === value)));
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: "", t: 0 });

  const selected = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Keep the active option in view
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const openList = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };
  const commit = (i: number) => {
    const o = options[i];
    if (!o || o.disabled) return;
    onChange(o.value);
    setOpen(false);
    buttonRef.current?.focus();
  };
  const move = (delta: number) => {
    let i = active;
    for (let n = 0; n < options.length; n++) {
      i = Math.min(options.length - 1, Math.max(0, i + delta));
      if (!options[i]?.disabled) break;
    }
    setActive(i);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openList();
        else move(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) openList();
        else move(-1);
        break;
      case "Home":
        if (open) {
          e.preventDefault();
          setActive(0);
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setActive(options.length - 1);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) commit(active);
        else openList();
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
      case "Tab":
        if (open) setOpen(false);
        break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const now = Date.now();
          const t = typeahead.current;
          t.text = now - t.t > 600 ? e.key.toLowerCase() : t.text + e.key.toLowerCase();
          t.t = now;
          const i = options.findIndex((o) => o.label.toLowerCase().startsWith(t.text));
          if (i >= 0) {
            if (open) setActive(i);
            else onChange(options[i].value);
          }
        }
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {name &&
        (required ? (
          // type="hidden" is never validated → a visually hidden text input carries `required`, so the browser
          // blocks submit and shows its message here; focusing it forwards focus to the combobox.
          <input
            name={name}
            value={value}
            required
            onChange={() => {}}
            onFocus={() => buttonRef.current?.focus()}
            tabIndex={-1}
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-4 h-px w-px opacity-0"
          />
        ) : (
          <input type="hidden" name={name} value={value} />
        ))}
      <button
        ref={buttonRef}
        id={baseId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={label}
        aria-activedescendant={open ? `${baseId}-opt-${active}` : undefined}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-full border bg-ink-700 pr-3 text-left font-medium text-white transition-colors",
          size === "lg" ? "h-12 pl-5 text-base" : "h-11 pl-4 text-sm",
          open ? "border-white" : invalid ? "border-danger" : "border-white/45 hover:border-white/75",
          "focus-visible:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-optic-500/40",
        )}
      >
        {icon && <span className="shrink-0 text-white [&>svg]:size-4" aria-hidden>{icon}</span>}
        <span className={cn("min-w-0 flex-1 truncate", !selected && "text-white/70")}>{selected?.label ?? placeholder ?? label}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-white/80 transition-transform", open && "rotate-180")} aria-hidden />
      </button>

      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        aria-label={label}
        tabIndex={-1}
        hidden={!open}
        className="absolute left-0 top-[calc(100%+6px)] z-50 max-h-80 min-w-full overflow-y-auto overscroll-contain rounded-2xl border border-white/15 bg-ink-700/95 p-1.5 shadow-elevated backdrop-blur-xl"
      >
        {options.map((o, i) => {
          const isSel = o.value === value;
          return (
            <li
              key={o.value || "__all"}
              id={`${baseId}-opt-${i}`}
              data-index={i}
              role="option"
              aria-selected={isSel}
              aria-disabled={o.disabled || undefined}
              onPointerEnter={() => setActive(i)}
              onClick={() => commit(i)}
              className={cn(
                "flex min-h-11 cursor-pointer items-center gap-3 whitespace-nowrap rounded-xl px-3 text-sm transition-colors",
                i === active && "bg-white/10",
                isSel ? "font-semibold text-white" : "text-white/85",
                o.disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <Check className={cn("size-4 shrink-0 text-magenta-300", !isSel && "invisible")} aria-hidden />
              <span className="flex-1">{o.label}</span>
              {o.count !== undefined && <span className="tabular-nums text-white/70">{o.count}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
