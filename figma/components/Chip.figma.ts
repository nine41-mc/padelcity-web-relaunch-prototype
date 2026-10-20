// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15120-139
// source=src/components/ui/Chip.tsx
// component=Chip
import figma from 'figma'
const instance = figma.selectedInstance
const label = instance.getString('Label')
const tone = instance.getEnum('Tone', { Default: 'default', Gradient: 'gradient', Solid: 'solid', Dark: 'dark', Level: 'level' })

export default {
  example: figma.code`<Chip tone="${tone}">${label}</Chip>`,
  imports: ['import { Chip } from "@/components/ui/Chip"'],
  id: 'chip',
  metadata: { nestable: true },
}
