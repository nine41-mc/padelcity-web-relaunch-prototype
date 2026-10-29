// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15972-84
// source=src/components/forms/YesNoRow.tsx
// component=YesNoRow
// figma=Yes-No Row
import figma from 'figma'
const instance = figma.selectedInstance
const title = instance.getString('Title')
const text = instance.getString('Text')
const value = instance.getEnum('Value', { Yes: true, No: false })

export default {
  example: figma.code`<YesNoRow name={name} title="${title}" text="${text}" yes="Ja" no="Nein" value={${value}} onChange={setValue} />`,
  imports: ['import { YesNoRow } from "@/components/forms/YesNoRow"'],
  id: 'yes-no-row',
  metadata: { nestable: true },
}
