// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15205-671
// source=src/components/locations/FilterSheet.tsx
// component=sheetChip
import figma from 'figma'
const instance = figma.selectedInstance
// Filter chips are plain buttons styled with sheetChip(active) (club finder filter sheet).
const label = instance.getString('Label')
const active = instance.getEnum('State', { Default: false, Active: true })
const hasIcon = instance.getEnum('Has Icon', { true: true, false: false })
const icon = hasIcon ? instance.getInstanceSwap('Icon') : null
let iconCode
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example
}

export default {
  example: figma.code`<button type="button" aria-pressed={${active}} onClick={toggle} className={sheetChip(${active})}>${iconCode}${label}</button>`,
  imports: ['import { sheetChip } from "@/components/locations/FilterSheet"'],
  id: 'filter-chip',
  metadata: { nestable: true },
}
