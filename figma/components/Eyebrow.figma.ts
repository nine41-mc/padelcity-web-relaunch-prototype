// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15120-140
// source=src/components/ui/Headline.tsx
// component=Eyebrow
// figma=Eyebrow
import figma from 'figma'
const instance = figma.selectedInstance
const label = instance.getString('Label')

export default {
  example: figma.code`<Eyebrow>${label}</Eyebrow>`,
  imports: ['import { Eyebrow } from "@/components/ui/Headline"'],
  id: 'eyebrow',
  metadata: { nestable: true },
}
