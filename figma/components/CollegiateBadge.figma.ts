// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=16090-802
// source=src/components/play/Collegiate.tsx
// component=CollegiateBadge
// figma=Collegiate Badge
import figma from 'figma'
const instance = figma.selectedInstance
const top = instance.getString('Top')
const main = instance.getString('Main')
const bottom = instance.getString('Bottom')

export default {
  example: figma.code`<CollegiateBadge top="${top}" main="${main}" bottom="${bottom}" />`,
  imports: ['import { CollegiateBadge } from "@/components/play/Collegiate"'],
  id: 'collegiate-badge',
  metadata: { nestable: false },
}
