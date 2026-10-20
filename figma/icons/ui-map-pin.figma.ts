// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15116-729
// source=node_modules/lucide-react
// component=MapPin
import figma from 'figma'
const instance = figma.selectedInstance

export default {
  example: figma.code`<MapPin className="size-5" aria-hidden />`,
  imports: ['import { MapPin } from "lucide-react"'],
  id: 'icon-ui-map-pin',
  metadata: { nestable: true },
}
