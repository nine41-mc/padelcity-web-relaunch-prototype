// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15116-666
// source=node_modules/lucide-react
// component=CalendarDays
import figma from 'figma'
const instance = figma.selectedInstance

export default {
  example: figma.code`<CalendarDays className="size-5" aria-hidden />`,
  imports: ['import { CalendarDays } from "lucide-react"'],
  id: 'icon-ui-calendar-days',
  metadata: { nestable: true },
}
