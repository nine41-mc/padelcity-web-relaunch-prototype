// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15116-768
// source=node_modules/lucide-react
// component=Search
import figma from 'figma'
const instance = figma.selectedInstance

export default {
  example: figma.code`<Search className="size-5" aria-hidden />`,
  imports: ['import { Search } from "lucide-react"'],
  id: 'icon-ui-search',
  metadata: { nestable: true },
}
