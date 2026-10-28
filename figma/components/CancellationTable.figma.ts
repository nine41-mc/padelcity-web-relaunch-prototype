// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15866-689
// source=src/components/events/EventFacts.tsx
// component=CancellationTable
// figma=Cancellation Table
import figma from 'figma'
// Only for the APL rule freeCancellation = UNTIL_24H_BEFORE_EVENT; cutoff = event start − 24 h.

export default {
  example: figma.code`<CancellationTable cutoff={new Date(new Date(event.start).getTime() - 24 * 60 * 60 * 1000)} locale={locale} />`,
  imports: ['import { CancellationTable } from "@/components/events/EventFacts"'],
  id: 'cancellation-table',
  metadata: { nestable: false },
}
