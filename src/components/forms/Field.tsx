import { cn } from "../ui/cn";

/** Glass input on dark panels (Figma: Input/Glass) – shared by text fields, textareas and the lead form. */
export const fieldClass = (invalid?: boolean) =>
  cn(
    "w-full rounded-2xl border bg-canvas-deep/40 px-4 text-fg placeholder:text-fg/60 transition-colors focus:outline-none focus:ring-2",
    invalid ? "border-danger focus:border-danger focus:ring-danger/40" : "border-fg/45 focus:border-focus focus:ring-focus/50",
  );

/** Label line: required star in magenta, optional note in grey. */
export function FieldLabel({ htmlFor, id, required, optional, children }: { htmlFor?: string; id?: string; required?: boolean; optional?: string; children: React.ReactNode }) {
  const Tag = htmlFor ? "label" : "span";
  return (
    <Tag htmlFor={htmlFor} id={id} className="mb-2 block text-sm font-medium text-fg/85">
      {children}
      {required && <span className="text-accent-fg"> *</span>}
      {optional && <span className="font-normal text-fg/70"> {optional}</span>}
    </Tag>
  );
}

/** Hint below a field; an error replaces it (Figma: Message, State=Error). */
export function FieldMessage({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  if (!error && !hint) return null;
  return (
    <p id={id} className={cn("mt-2 text-sm", error ? "text-danger-fg" : "text-fg/75")}>
      {error ?? hint}
    </p>
  );
}

type Common = { id: string; label: string; required?: boolean; optional?: string; hint?: string; error?: string; className?: string };

/** Text field with label, hint and error (Figma: Input / Text). Uncontrolled unless `value` is passed. */
export function TextField({
  id,
  label,
  required,
  optional,
  hint,
  error,
  className,
  ...input
}: Common & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "required" | "className">) {
  const msg = `${id}-msg`;
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={required} optional={optional}>
        {label}
      </FieldLabel>
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? msg : undefined}
        className={cn(fieldClass(!!error), "h-12")}
        {...input}
      />
      <FieldMessage id={msg} error={error} hint={hint} />
    </div>
  );
}

/** Multi-line field (Figma: Input / Textarea). */
export function TextareaField({
  id,
  label,
  required,
  optional,
  hint,
  error,
  className,
  rows = 6,
  ...textarea
}: Common & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "required" | "className">) {
  const msg = `${id}-msg`;
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={required} optional={optional}>
        {label}
      </FieldLabel>
      <textarea
        id={id}
        required={required}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? msg : undefined}
        className={cn(fieldClass(!!error), "block resize-y py-3")}
        {...textarea}
      />
      <FieldMessage id={msg} error={error} hint={hint} />
    </div>
  );
}
