// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15914-908
// source=src/components/home/GermanyMap.tsx
// component=GermanyMap
// figma=Club Map
import figma from 'figma'
// Pins are computed from the club entries (open + planned); labels from homeContent[locale].leader.

export default {
  example: figma.code`<GermanyMap clubs={clubs} planned={planned} locale={locale} label={t.leader.mapLabel} hint={t.leader.mapHint} legend={t.leader.legend} />`,
  imports: ['import { GermanyMap } from "@/components/home/GermanyMap"'],
  id: 'club-map',
  metadata: { nestable: false },
}
