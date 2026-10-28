// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15210-497
// source=src/components/locations/ClubMap.tsx
// component=pin
// figma=Map Pin
import figma from 'figma'
const instance = figma.selectedInstance
// Leaflet divIcon from ClubMap.tsx (module-internal helper pin(active, planned); styles in locations/map.css).
const active = instance.getEnum('State', { Default: false, Active: true, Planned: false })
const planned = instance.getEnum('State', { Default: false, Active: false, Planned: true })

export default {
  example: figma.code`L.marker(position, { icon: pin(${active}, ${planned}) })`,
  imports: [],
  id: 'map-pin',
  metadata: { nestable: true },
}
