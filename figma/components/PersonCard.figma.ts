// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15868-638
// source=src/components/brand/PersonCard.tsx
// component=PersonCard
// figma=Person Card
import figma from 'figma'
const instance = figma.selectedInstance
// Name, role and photo come from the person entry: Photo=false is the branded initials placeholder the card renders
// when person.image is empty (initials from the name), never a stand-in photo of someone else.
const bio = instance.getEnum('Bio', { true: true, false: false })

export default {
  example: figma.code`<PersonCard person={person} locale={locale}${bio ? ' showBio' : ''} />`,
  imports: ['import { PersonCard } from "@/components/brand/PersonCard"'],
  id: 'person-card',
  metadata: { nestable: true },
}
