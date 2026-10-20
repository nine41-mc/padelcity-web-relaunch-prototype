// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15116-759
// source=node_modules/lucide-react
// component=Plus
import figma from 'figma'
const instance = figma.selectedInstance

export default {
  example: figma.code`<Plus className="size-5" aria-hidden />`,
  imports: ['import { Plus } from "lucide-react"'],
  id: 'icon-ui-plus',
  metadata: { nestable: true },
}
