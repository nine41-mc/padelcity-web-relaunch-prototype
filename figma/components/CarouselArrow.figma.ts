// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15210-487
// source=src/components/ui/CarouselArrow.tsx
// component=CarouselArrow
import figma from 'figma'
const instance = figma.selectedInstance
const direction = instance.getEnum('Direction', { Prev: 'prev', Next: 'next' })
const disabled = instance.getEnum('State', { Default: false, Hover: false, Disabled: true })

export default {
  example: figma.code`<CarouselArrow direction="${direction}" label={labels.${direction}} onClick={() => scroll(${direction === 'prev' ? -1 : 1})}${disabled ? ' disabled' : ''} controls={trackId} />`,
  imports: ['import { CarouselArrow } from "@/components/ui/CarouselArrow"'],
  id: 'carousel-arrow',
  metadata: { nestable: true },
}
