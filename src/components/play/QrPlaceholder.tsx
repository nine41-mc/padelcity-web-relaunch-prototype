import { cn } from "@/components/ui/cn";

/** Deterministic pseudo-QR pattern. TODO: replace with real QR (Adjust smart link → stores). */
const N = 25;
function cells() {
  const out: [number, number][] = [];
  let seed = 7;
  const finder = (x: number, y: number) => (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      seed = (seed * 9301 + 49297) % 233280;
      if (!finder(x, y) && seed / 233280 > 0.52) out.push([x, y]);
    }
  return out;
}
const modules = cells();

function Finder({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="7" height="7" fill="currentColor" />
      <rect x="1" y="1" width="5" height="5" fill="white" />
      <rect x="2" y="2" width="3" height="3" fill="currentColor" />
    </g>
  );
}

export function QrPlaceholder({ className, labels }: { className?: string; labels: { title: string; text: string; aria: string } }) {
  return (
    <figure className={cn("flex items-center gap-4 rounded-[20px] border border-white/10 bg-white/[0.04] p-4", className)}>
      <div className="rounded-xl bg-white p-2 text-ink-800">
        <svg viewBox={`-1 -1 ${N + 2} ${N + 2}`} className="size-24" role="img" aria-label={labels.aria} shapeRendering="crispEdges">
          <rect x="-1" y="-1" width={N + 2} height={N + 2} fill="white" />
          {modules.map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />
          ))}
          <Finder x={0} y={0} />
          <Finder x={N - 7} y={0} />
          <Finder x={0} y={N - 7} />
        </svg>
      </div>
      <figcaption className="text-sm">
        <span className="block font-semibold">{labels.title}</span>
        <span className="text-white/70">{labels.text}</span>
      </figcaption>
    </figure>
  );
}
