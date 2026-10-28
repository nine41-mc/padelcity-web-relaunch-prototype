import Link from "next/link";
import { cn } from "../ui/cn";

/** One item of the main navigation in the header (Figma: Nav Item) – active page with the gradient underline. */
export function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative rounded-full px-2.5 py-2 text-[15px] font-semibold uppercase tracking-[0.06em] transition-colors xl:px-4 xl:text-base",
        active ? "text-white" : "text-white/85 hover:text-white",
      )}
    >
      {children}
      {active && <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brand-gradient" />}
    </Link>
  );
}
