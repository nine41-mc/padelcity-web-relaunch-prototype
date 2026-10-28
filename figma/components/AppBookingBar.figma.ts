// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15210-509
// source=src/components/locations/AppBookingBar.tsx
// component=AppBookingBar
// figma=Booking Bar
import figma from 'figma'
const instance = figma.selectedInstance
const textOf = (layer: string) => {
  const t = instance.findText(layer)
  return t.type === 'TEXT' ? t.textContent : ''
}
const price = textOf('Value')

export default {
  example: figma.code`<AppBookingBar href={appHref} price="${price}" locale="de" />`,
  imports: ['import { AppBookingBar } from "@/components/locations/AppBookingBar"'],
  id: 'app-booking-bar',
  metadata: { nestable: false },
}
