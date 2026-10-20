// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15116-558
// source=src/components/ui/Icon.tsx
// component=AppIcon
import figma from 'figma'
const instance = figma.selectedInstance

export default {
  example: figma.code`<AppIcon name="bar" />`,
  imports: ['import { AppIcon } from "@/components/ui/Icon"'],
  id: 'icon-app-bar',
  metadata: { nestable: true },
}
