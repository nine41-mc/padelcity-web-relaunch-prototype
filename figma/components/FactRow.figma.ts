// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15864-544
// source=src/components/events/EventFacts.tsx
// component=FactRow
// figma=Fact Row
import figma from 'figma'
const instance = figma.selectedInstance
// One key fact of an event; render inside a <dl> (EventSignupCard or the left column of the event detail).
const label = instance.getString('Label')
const value = instance.getString('Value')
const icon = instance.getInstanceSwap('Icon')
let iconCode
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example
}

export default {
  example: figma.code`<FactRow icon={${iconCode}} label="${label}">
  ${value}
</FactRow>`,
  imports: ['import { FactRow } from "@/components/events/EventFacts"'],
  id: 'fact-row',
  metadata: { nestable: true },
}
