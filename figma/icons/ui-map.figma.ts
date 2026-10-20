// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15116-726
// source=node_modules/lucide-react
// component=MapIcon
import figma from 'figma'
const instance = figma.selectedInstance

export default {
  example: figma.code`<MapIcon className="size-5" aria-hidden />`,
  imports: ['import { Map as MapIcon } from "lucide-react"'],
  id: 'icon-ui-map',
  metadata: { nestable: true },
}
