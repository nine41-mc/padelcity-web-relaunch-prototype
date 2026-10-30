import { asset } from "@/lib/asset";
import { cn } from "../ui/cn";

/*
 * Gift voucher as a card – modelled on the physical PadelCity voucher (grey Figma variant): light concrete
 * surface, brand-gradient chevrons top left and bottom right, the PadelCity symbol top right, the label and
 * the value in the lower left. No chip – it's a voucher, not a payment card. Decorative; the label carries the meaning.
 */

// Concrete grain: fine dark specks on light grey (inline SVG noise – no extra asset)
const CONCRETE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.35  0 0 0 0 0.36  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/** Row of chevrons ">" in the brand gradient (rotate the wrapper for the vertical stack). */
function Chevrons({ count, id, className }: { count: number; id: string; className?: string }) {
  const w = 28;
  return (
    <svg viewBox={`0 0 ${count * w + 18} 40`} className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8412b5" />
          <stop offset="1" stopColor="#dc05a1" />
        </linearGradient>
      </defs>
      {Array.from({ length: count }, (_, i) => (
        <path key={i} d={`M${i * w} 0h13l20 20-20 20h-13l20-20z`} fill={`url(#${id})`} />
      ))}
    </svg>
  );
}

/** Stack of chevrons "^" pointing up (bottom-right edge of the card). */
function ChevronsUp({ count, id, className }: { count: number; id: string; className?: string }) {
  const step = 28;
  const h = count * step + 18;
  return (
    <svg viewBox={`0 0 40 ${h}`} className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#8412b5" />
          <stop offset="1" stopColor="#dc05a1" />
        </linearGradient>
      </defs>
      {Array.from({ length: count }, (_, i) => {
        const y = i * step;
        return <path key={i} d={`M0 ${y + 20}L20 ${y}L40 ${y + 20}V${y + 33}L20 ${y + 13}L0 ${y + 33}Z`} fill={`url(#${id})`} />;
      })}
    </svg>
  );
}

export function VoucherCard({ label, amount, aria, className }: { label: string; amount: string; aria: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={aria}
      data-theme="dark"
      className={cn(
        "relative aspect-[1.65] w-full overflow-hidden rounded-[22px] bg-[#ebebeb] text-ink-800 shadow-[0_40px_90px_-30px_rgb(224_5_195/0.55)] ring-1 ring-black/5 [container-type:inline-size]",
        className,
      )}
    >
      {/* concrete: soft light/shade patches + grain */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_25%_30%,rgb(255_255_255/0.7),transparent),radial-gradient(50%_60%_at_80%_80%,rgb(0_0_0/0.06),transparent)]" aria-hidden />
      <div className="absolute inset-0 opacity-60 mix-blend-multiply" style={{ backgroundImage: CONCRETE }} aria-hidden />

      <Chevrons count={7} id="vc-chev-top" className="absolute left-[3%] top-0 h-[11%] w-auto" />
      <ChevronsUp count={6} id="vc-chev-side" className="absolute -bottom-[2%] right-0 h-[48%] w-auto" />
      {/* PadelCity symbol entirely in the brand gradient (as on the physical voucher): gradient masked by the symbol shape */}
      <span
        className="absolute right-[5%] top-[8%] aspect-[310.51/311.04] w-[19%] bg-[linear-gradient(135deg,#8412b5,#dc05a1)]"
        style={{ maskImage: `url(${asset("/brand/symbol-color.svg")})`, WebkitMaskImage: `url(${asset("/brand/symbol-color.svg")})`, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat" }}
        aria-hidden
      />

      <div className="absolute bottom-[9%] left-[7%] pr-[16%]">
        <p className="font-display text-[clamp(28px,11cqw,64px)] font-extrabold italic uppercase leading-[0.85]">{label}</p>
        <p className="mt-[2cqw] text-[clamp(12px,3.6cqw,20px)] font-semibold">{amount}</p>
      </div>
    </div>
  );
}
