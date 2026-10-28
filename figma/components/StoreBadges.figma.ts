// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15210-508
// source=src/components/ui/StoreBadges.tsx
// component=StoreBadges
// figma=Store Badge
import figma from 'figma'
const instance = figma.selectedInstance
// The code component always renders both badges (App Store + Google Play).

export default {
  example: figma.code`<StoreBadges locale="de" />`,
  imports: ['import { StoreBadges } from "@/components/ui/StoreBadges"'],
  id: 'store-badges',
  metadata: { nestable: true },
}
