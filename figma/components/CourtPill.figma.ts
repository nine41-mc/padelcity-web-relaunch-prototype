// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15864-560
// source=src/components/locations/CourtPill.tsx
// component=CourtPill
// figma=Court Pill
import figma from 'figma'
const instance = figma.selectedInstance
// courtType is the APL court type prefix of the app icon ("double" → double_court, "single" → single_court).
const label = instance.getString('Label')

export default {
  example: figma.code`<CourtPill courtType={court.type} label="${label}" />`,
  imports: ['import { CourtPill } from "@/components/locations/CourtPill"'],
  id: 'court-pill',
  metadata: { nestable: true },
}
