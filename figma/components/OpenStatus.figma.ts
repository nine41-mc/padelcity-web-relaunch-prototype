// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15864-598
// source=src/components/cards/ClubMeta.tsx
// component=OpenStatus
// figma=Open Status
import figma from 'figma'
// The status variants are computed on the client from club.openingHours (openStatusText in src/components/locations/geo.ts).

export default {
  example: figma.code`<OpenStatus club={club} locale={locale} />`,
  imports: ['import { OpenStatus } from "@/components/cards/ClubMeta"'],
  id: 'open-status',
  metadata: { nestable: true },
}
