// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15866-568
// source=src/components/ui/InfoTile.tsx
// component=InfoTile
import figma from 'figma'
const instance = figma.selectedInstance
const label = instance.getString('Label')
const value = instance.getString('Value')
const text = instance.getString('Text')
const size = instance.getEnum('Size', { M: 'md', L: 'lg' })

export default {
  example: figma.code`<InfoTile label="${label}" value="${value}" text="${text}"${size === 'lg' ? ' size="lg"' : ''} />`,
  imports: ['import { InfoTile } from "@/components/ui/InfoTile"'],
  id: 'info-tile',
  metadata: { nestable: true },
}
