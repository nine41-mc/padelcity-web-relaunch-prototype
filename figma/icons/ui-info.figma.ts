// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15860-51
// source=node_modules/lucide-react
// component=Info
import figma from 'figma'
const instance = figma.selectedInstance

export default {
  example: figma.code`<Info className="size-5" aria-hidden />`,
  imports: ['import { Info } from "lucide-react"'],
  id: 'icon-ui-info',
  metadata: { nestable: true },
}
