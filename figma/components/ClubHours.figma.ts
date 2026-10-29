// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15995-830
// source=src/components/locations/ClubHours.tsx
// component=ClubHours
// figma=Club Hours
import figma from 'figma'
// Open/closed is a runtime state (the status line toggles the week list); status text, today and the week come
// from club.openingHours and are set in the browser.

export default {
  example: figma.code`<ClubHours club={club} locale={locale} />`,
  imports: ['import { ClubHours } from "@/components/locations/ClubHours"'],
  id: 'club-hours',
  metadata: { nestable: true },
}
