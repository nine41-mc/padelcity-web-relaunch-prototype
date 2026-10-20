// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15116-747
// source=node_modules/lucide-react
// component=Navigation
import figma from 'figma'
const instance = figma.selectedInstance

export default {
  example: figma.code`<Navigation className="size-5" aria-hidden />`,
  imports: ['import { Navigation } from "lucide-react"'],
  id: 'icon-ui-navigation',
  metadata: { nestable: true },
}
