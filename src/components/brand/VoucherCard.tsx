import { asset } from "@/lib/asset";
import { cn } from "../ui/cn";

// Grain like on the poster tiles (inline SVG noise – no extra asset)
const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/**
 * Gift voucher as a card (credit-card format 85.6 × 54 mm): brand gradient with grain,
 * PadelCity logo, a chip, the amount big in Söhne Schmal. Decorative – the label carries the meaning.
 */
export function VoucherCard({ label, amount, aria, className }: { label: string; amount: string; aria: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={aria}
      className={cn(
        "relative aspect-[1.586] w-full overflow-hidden [container-type:inline-size] rounded-[22px] bg-brand-gradient p-[7%] text-white shadow-[0_40px_90px_-30px_rgb(224_5_195/0.7)] ring-1 ring-white/25",
        className,
      )}
    >
      <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: NOISE }} aria-hidden />
      {/* light sweep + big symbol watermark */}
      <div className="absolute -right-1/4 -top-1/2 size-[120%] rounded-full bg-white/10 blur-2xl" aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/brand/symbol-color-white.svg")} alt="" className="absolute -bottom-[18%] -right-[8%] w-[48%] opacity-15" aria-hidden />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/brand/logo-white-line.svg")} alt="" className="h-[6cqw] w-auto" aria-hidden />
          <span className="text-[clamp(10px,2.4cqw,13px)] font-semibold uppercase tracking-[0.25em] text-white/85">{label}</span>
        </div>
        {/* chip */}
        <span className="block h-[17%] w-[13%] rounded-[6px] bg-gradient-to-br from-[#f3e2a6] via-[#d8b45c] to-[#b08a35] shadow-inner" aria-hidden />
        <div className="flex items-end justify-between">
          <span className="font-mono text-[clamp(11px,2.8cqw,16px)] tracking-[0.2em] text-white/80">•••• PADEL</span>
          <span className="font-display text-[clamp(44px,13cqw,92px)] font-extrabold italic leading-[0.8]">{amount}</span>
        </div>
      </div>
    </div>
  );
}
