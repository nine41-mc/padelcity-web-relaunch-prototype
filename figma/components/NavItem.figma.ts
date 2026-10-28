// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15918-672
// source=src/components/layout/NavLink.tsx
// component=NavLink
// figma=Nav Item
import figma from 'figma'
const instance = figma.selectedInstance
// Rendered by <Header /> for every main navigation entry; active = the current page (aria-current="page").
// "Hover" is the CSS hover state, no prop.
const label = instance.getString('Label')
const active = instance.getEnum('State', { Default: false, Hover: false, Active: true })

export default {
  example: figma.code`<NavLink href={href(locale, "events")} active={${active}}>
  ${label}
</NavLink>`,
  imports: ['import { NavLink } from "@/components/layout/NavLink"'],
  id: 'nav-item',
  metadata: { nestable: true },
}
