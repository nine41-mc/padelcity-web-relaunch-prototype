// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15866-730
// source=src/components/play/Countdown.tsx
// component=Countdown
// figma=Countdown
import figma from 'figma'
const instance = figma.selectedInstance
const size = instance.getEnum('Size', { M: 'md', S: 'sm' })

export default {
  example: figma.code`<Countdown start={event.start} labels={t.countdown}${size === 'sm' ? ' size="sm"' : ''} />`,
  imports: ['import { Countdown } from "@/components/play/Countdown"'],
  id: 'countdown',
  metadata: { nestable: true },
}
