// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15116-792
// source=node_modules/lucide-react
// component=User
import figma from 'figma'
const instance = figma.selectedInstance

export default {
  example: figma.code`<User className="size-5" aria-hidden />`,
  imports: ['import { User } from "lucide-react"'],
  id: 'icon-ui-user',
  metadata: { nestable: true },
}
