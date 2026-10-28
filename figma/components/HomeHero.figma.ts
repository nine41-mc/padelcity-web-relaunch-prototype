// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15919-3331
// source=src/components/home/HomeHero.tsx
// component=HomeHero
// figma=Home Hero
import figma from 'figma'
// Claim, lead, CTAs and search texts come from homeContent[locale].hero (Contentful module heroHome).
// Video on tablet/desktop, poster only on phones; the pause button is part of the component.

export default {
  example: figma.code`<HomeHero locale={locale} t={homeContent[locale].hero} />`,
  imports: ['import { HomeHero } from "@/components/home/HomeHero"', 'import { homeContent } from "@/lib/content/home"'],
  id: 'home-hero',
  metadata: { nestable: false },
}
