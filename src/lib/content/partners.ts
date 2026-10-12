import type { Partner } from "../data/types";

/** Partner logos from mobile-app-flutter/assets/images/logo_*. Tiers are illustrative. */
export const partners: Partner[] = [
  { name: "CUPRA", logo: "/brand/partners/cupra.svg", tier: "premium", since: "2023", description: "Mobility Partner & Presenter der One Point Challenge" },
  { name: "Babolat", logo: "/brand/partners/babo.svg", tier: "premium", since: "2025", description: "Official Racket & Ball Partner, PadelCity Series" },
  { name: "Haier", logo: "/brand/partners/haier.svg", tier: "official", since: "2025", description: "Trikot-Sponsor" },
  { name: "Natural Elements", logo: "/brand/partners/natural_elements.svg", tier: "official", since: "2025", description: "Trikot-Sponsor" },
  { name: "FALKE", logo: "/brand/partners/falke.svg", tier: "official", since: "2025" },
  { name: "HanseMerkur", logo: "/brand/partners/hanse_merkur.svg", tier: "official" },
  { name: "DECATHLON", logo: "/brand/partners/decathlon.svg", tier: "official" },
  { name: "Veltins", logo: "/brand/partners/veltins.png", tier: "supplier" },
  { name: "Rituals", logo: "/brand/partners/rituals.png", tier: "supplier" },
  { name: "Coca-Cola", logo: "/brand/partners/coca_cola.png", tier: "supplier" },
  { name: "Langnese", logo: "/brand/partners/langnese.png", tier: "supplier" },
  { name: "CapTrader", logo: "/brand/partners/cap_trader.svg", tier: "supplier" },
  { name: "All Inclusive Fitness", logo: "/brand/partners/all_inclusive_fitness.png", tier: "supplier" },
];

/** Company-level key figures – public numbers approved by Marketing (Oct 2026): 30+ clubs, 200+ courts, 25+ cities. No Series A figures. */
export const keyFacts = {
  clubs: 30,
  courts: 200,
  cities: 25,
  foundedYear: 2022,
  firstClub: "Ingolstadt",
};
