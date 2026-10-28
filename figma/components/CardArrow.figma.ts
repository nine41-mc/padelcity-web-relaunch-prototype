// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15864-543
// source=src/components/ui/CardArrow.tsx
// component=CardArrow
// figma=Card Arrow
import figma from 'figma'
const instance = figma.selectedInstance
// Decorative round arrow in the corner of a linked card; the card itself is the link (group hover turns it 45°).
// tone: glass (default, dark cards) · photo (on photos) · solid (featured article); size: md 44 px · sm 36 px.
const tone = instance.getEnum('Tone', { Glass: 'glass', Photo: 'photo', Solid: 'solid' })
const size = instance.getEnum('Size', { M: 'md', S: 'sm' })

export default {
  example: figma.code`<CardArrow${tone === 'glass' ? '' : ` tone="${tone}"`}${size === 'md' ? '' : ' size="sm"'} />`,
  imports: ['import { CardArrow } from "@/components/ui/CardArrow"'],
  id: 'card-arrow',
  metadata: { nestable: true },
}
