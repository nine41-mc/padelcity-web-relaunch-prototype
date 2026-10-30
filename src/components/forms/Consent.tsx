import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { brandStrings } from "../brand/strings";
import { cn } from "../ui/cn";
import { FieldMessage } from "./Field";

/**
 * Consent checkbox with the link to the privacy policy (Figma: Consent, Checked=false/true). Uncontrolled unless
 * `checked` is passed; `error` marks it for forms that validate themselves.
 */
export function Consent({
  locale,
  id,
  text,
  error,
  className,
  ...input
}: {
  locale: Locale;
  id: string;
  text?: string;
  error?: string;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "type" | "className">) {
  const t = brandStrings[locale].leadForm;
  const msg = `${id}-msg`;
  return (
    <div className={className}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-fg/85">
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? msg : undefined}
          className={cn("size-6 shrink-0 accent-[#e005c3]", error && "outline-2 outline-offset-2 outline-danger")}
          {...input}
        />
        <span>
          {text ?? t.consent}{" "}
          <Link href={href(locale, "privacy")} className="underline underline-offset-2 hover:text-fg">
            {t.privacy}
          </Link>
          . <span className="text-accent-fg">*</span>
        </span>
      </label>
      <FieldMessage id={msg} error={error} />
    </div>
  );
}
