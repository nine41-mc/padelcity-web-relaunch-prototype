// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15226-528
// source=src/components/ui/Section.tsx
// component=Section
import figma from 'figma'
const instance = figma.selectedInstance
const tone = instance.getEnum('Tone', { ink: 'ink', black: 'black', purple: 'purple', light: 'light' })

export default {
  example: figma.code`<Section${tone === 'ink' ? '' : ` tone="${tone}"`}>
  {/* Section Intro, Grid, Karten … */}
</Section>`,
  imports: ['import { Section } from "@/components/ui/Section"'],
  id: 'section',
  metadata: { nestable: false },
}
