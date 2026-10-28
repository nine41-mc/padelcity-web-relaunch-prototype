// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15122-168
// source=src/components/cards/ClubCard.tsx
// component=ClubCard
// figma=Club Card
import figma from 'figma'
const instance = figma.selectedInstance

export default {
  example: figma.code`<ClubCard club={club} locale="de" />`,
  imports: ['import { ClubCard } from "@/components/cards/ClubCard"'],
  id: 'club-card',
  metadata: { nestable: false },
}
