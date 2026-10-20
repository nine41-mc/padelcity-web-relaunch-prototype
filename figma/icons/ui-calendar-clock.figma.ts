// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15116-663
// source=node_modules/lucide-react
// component=CalendarClock
import figma from 'figma'
const instance = figma.selectedInstance

export default {
  example: figma.code`<CalendarClock className="size-5" aria-hidden />`,
  imports: ['import { CalendarClock } from "lucide-react"'],
  id: 'icon-ui-calendar-clock',
  metadata: { nestable: true },
}
