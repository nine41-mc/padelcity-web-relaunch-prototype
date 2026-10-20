// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15116-783
// source=node_modules/lucide-react
// component=Star
import figma from 'figma'
const instance = figma.selectedInstance

export default {
  example: figma.code`<Star className="size-5" aria-hidden />`,
  imports: ['import { Star } from "lucide-react"'],
  id: 'icon-ui-star',
  metadata: { nestable: true },
}
