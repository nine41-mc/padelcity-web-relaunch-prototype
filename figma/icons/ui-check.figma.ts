// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15116-675
// source=node_modules/lucide-react
// component=Check
import figma from 'figma'
const instance = figma.selectedInstance

export default {
  example: figma.code`<Check className="size-5" aria-hidden />`,
  imports: ['import { Check } from "lucide-react"'],
  id: 'icon-ui-check',
  metadata: { nestable: true },
}
