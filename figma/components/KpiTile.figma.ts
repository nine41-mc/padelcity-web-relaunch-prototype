// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15210-448
// source=src/components/brand/KpiTiles.tsx
// component=KpiTiles
// figma=KPI Tile
import figma from 'figma'
const instance = figma.selectedInstance
const textOf = (layer: string) => {
  const t = instance.findText(layer)
  return t.type === 'TEXT' ? t.textContent : ''
}
// One Figma tile = one item of KpiTiles (grid of 2/4 tiles in code).
const label = textOf('Label')
const raw = textOf('Value')
const m = raw.match(/^([\d.]+)(.*)$/)
const value = m ? m[1].replace(/\./g, '') : '0'
const suffix = m ? m[2] : ''
const hasNote = instance.getBoolean('Note')
const note = hasNote ? textOf('Note') : ''

export default {
  example: figma.code`<KpiTiles intl="de-DE" items={[{ label: "${label}", value: ${value}, suffix: "${suffix}"${hasNote ? figma.code`, note: "${note}"` : ''} }]} />`,
  imports: ['import { KpiTiles } from "@/components/brand/KpiTiles"'],
  id: 'kpi-tile',
  metadata: { nestable: true },
}
