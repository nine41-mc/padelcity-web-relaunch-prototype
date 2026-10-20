// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15210-498
// source=src/components/a11y/A11yPanel.tsx
// component=A11yPanel
import figma from 'figma'
const instance = figma.selectedInstance
// The round button opens the display panel; A11yPanel renders both (button + sheet).

export default {
  example: figma.code`<A11yPanel />`,
  imports: ['import { A11yPanel } from "@/components/a11y/A11yPanel"'],
  id: 'a11y-panel',
  metadata: { nestable: false },
}
