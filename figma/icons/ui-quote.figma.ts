// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15116-762
// source=node_modules/lucide-react
// component=Quote
import figma from 'figma'
const instance = figma.selectedInstance

export default {
  example: figma.code`<Quote className="size-5" aria-hidden />`,
  imports: ['import { Quote } from "lucide-react"'],
  id: 'icon-ui-quote',
  metadata: { nestable: true },
}
