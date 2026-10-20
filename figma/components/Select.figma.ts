// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15205-729
// source=src/components/ui/Select.tsx
// component=Select
import figma from 'figma'
const instance = figma.selectedInstance
// "Open" is a runtime state (listbox open), not a prop. In the Default state the shown text is the placeholder.
const size = instance.getEnum('Size', { M: 'md', L: 'lg' })
const text = instance.getString('Value')
const placeholder = instance.getEnum('State', { Default: text, Selected: '', Open: '' })

export default {
  example: figma.code`<Select label={label} value={value} onChange={setValue} options={options} size="${size}"${placeholder ? figma.code` placeholder="${placeholder}"` : ''} />`,
  imports: ['import { Select } from "@/components/ui/Select"'],
  id: 'select',
  metadata: { nestable: true },
}
