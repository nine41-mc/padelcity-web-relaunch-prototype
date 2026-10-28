// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15122-59
// source=src/components/ui/CardArrow.tsx
// component=CardArrow
import figma from 'figma'
// Decorative round arrow in the corner of a linked card; the card itself is the link (group hover turns it 45°).
// tone: glass (default, dark cards) · photo (on photos) · solid (featured article); size: md 44 px · sm 36 px.

export default {
  example: figma.code`<CardArrow />`,
  imports: ['import { CardArrow } from "@/components/ui/CardArrow"'],
  id: 'card-arrow',
  metadata: { nestable: true },
}
