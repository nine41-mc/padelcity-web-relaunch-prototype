// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15210-422
// source=src/components/play/coaches/CoachCard.tsx
// component=CoachCard
import figma from 'figma'
const instance = figma.selectedInstance
// The library tile is the compact grid tile; variant="feature" is the large carousel tile.

export default {
  example: figma.code`<CoachCard coach={coach} locale="de" labels={labels} clubs={clubs} variant="compact" onOpen={openCoach} />`,
  imports: ['import { CoachCard } from "@/components/play/coaches/CoachCard"'],
  id: 'coach-card',
  metadata: { nestable: false },
}
