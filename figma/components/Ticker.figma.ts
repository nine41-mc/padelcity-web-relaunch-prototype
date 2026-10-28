// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15122-248
// source=src/components/ui/Marquee.tsx
// component=Marquee
// figma=Ticker
import figma from 'figma'
const instance = figma.selectedInstance
// Optic Yellow band: Marquee with claim items and dots (see HomeView / Footer); includes the pause button (WCAG 2.2.2).

export default {
  example: figma.code`<Marquee>{items}</Marquee>`,
  imports: ['import { Marquee } from "@/components/ui/Marquee"'],
  id: 'ticker',
  metadata: { nestable: false },
}
