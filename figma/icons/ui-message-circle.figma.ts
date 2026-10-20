// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15116-735
// source=node_modules/lucide-react
// component=MessageCircle
import figma from 'figma'
const instance = figma.selectedInstance

export default {
  example: figma.code`<MessageCircle className="size-5" aria-hidden />`,
  imports: ['import { MessageCircle } from "lucide-react"'],
  id: 'icon-ui-message-circle',
  metadata: { nestable: true },
}
