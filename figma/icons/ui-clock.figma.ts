// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15116-687
// source=node_modules/lucide-react
// component=Clock
import figma from 'figma'
const instance = figma.selectedInstance

export default {
  example: figma.code`<Clock className="size-5" aria-hidden />`,
  imports: ['import { Clock } from "lucide-react"'],
  id: 'icon-ui-clock',
  metadata: { nestable: true },
}
