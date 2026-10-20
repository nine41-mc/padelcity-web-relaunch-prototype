// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15205-883
// source=src/components/layout/Footer.tsx
// component=Footer
import figma from 'figma'
const instance = figma.selectedInstance

export default {
  example: figma.code`<Footer locale="de" />`,
  imports: ['import { Footer } from "@/components/layout/Footer"'],
  id: 'footer',
  metadata: { nestable: false },
}
