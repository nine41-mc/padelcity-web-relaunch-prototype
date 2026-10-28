// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15205-490
// source=src/components/ui/Button.tsx
// component=Button
// figma=Button/Outline
import figma from 'figma'
const instance = figma.selectedInstance

// Figma "Icon" (instance swap) has no code counterpart: the code button always renders ArrowUpRight.
// "State" Hover/Focus are interaction states (CSS), only Disabled maps to a prop.
const label = instance.getString('Label')
const size = instance.getEnum('Size', { S: 'sm', M: 'md', L: 'lg' })
const arrow = instance.getEnum('Arrow', { true: true, false: false })
const disabled = instance.getEnum('State', { Default: false, Hover: false, Focus: false, Disabled: true })

export default {
  example: figma.code`<Button variant="outline" size="${size}"${arrow ? '' : ' arrow={false}'}${disabled ? ' disabled' : ''}>${label}</Button>`,
  imports: ['import { Button } from "@/components/ui/Button"'],
  id: 'button-outline',
  metadata: { nestable: true },
}
