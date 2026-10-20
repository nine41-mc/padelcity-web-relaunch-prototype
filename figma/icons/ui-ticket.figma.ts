// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15116-786
// source=node_modules/lucide-react
// component=Ticket
import figma from 'figma'
const instance = figma.selectedInstance

export default {
  example: figma.code`<Ticket className="size-5" aria-hidden />`,
  imports: ['import { Ticket } from "lucide-react"'],
  id: 'icon-ui-ticket',
  metadata: { nestable: true },
}
