// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15122-191
// source=src/components/cards/EventCard.tsx
// component=EventCard
// figma=Event Card
import figma from 'figma'
const instance = figma.selectedInstance

export default {
  example: figma.code`<EventCard event={event} locale="de" />`,
  imports: ['import { EventCard } from "@/components/cards/EventCard"'],
  id: 'event-card',
  metadata: { nestable: false },
}
