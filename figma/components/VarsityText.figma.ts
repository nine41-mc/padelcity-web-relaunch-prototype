// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=16090-799
// source=src/components/play/Collegiate.tsx
// component=VarsityText
// figma=Varsity Text
import figma from 'figma'
const instance = figma.selectedInstance
const text = instance.getString('Text')

export default {
  example: figma.code`<VarsityText>${text}</VarsityText>`,
  imports: ['import { VarsityText } from "@/components/play/Collegiate"'],
  id: 'varsity-text',
  metadata: { nestable: true },
}
