// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15116-774
// source=node_modules/lucide-react
// component=ShoppingBag
import figma from 'figma'
const instance = figma.selectedInstance

export default {
  example: figma.code`<ShoppingBag className="size-5" aria-hidden />`,
  imports: ['import { ShoppingBag } from "lucide-react"'],
  id: 'icon-ui-shopping-bag',
  metadata: { nestable: true },
}
