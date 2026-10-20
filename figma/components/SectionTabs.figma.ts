// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15205-735
// source=src/components/locations/SectionTabs.tsx
// component=SectionTabs
import figma from 'figma'
const instance = figma.selectedInstance
// Tabs are generated from the page sections ({ id, label }); the active tab follows the scroll position.

export default {
  example: figma.code`<SectionTabs label={label} items={sections} />`,
  imports: ['import { SectionTabs } from "@/components/locations/SectionTabs"'],
  id: 'section-tabs',
  metadata: { nestable: false },
}
