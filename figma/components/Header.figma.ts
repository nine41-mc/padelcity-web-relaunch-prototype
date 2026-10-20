// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15122-167
// source=src/components/layout/Header.tsx
// component=Header
import figma from 'figma'
const instance = figma.selectedInstance
// Desktop/Mobile is responsive in code (lg breakpoint); the mobile menu overlay is part of Header.

export default {
  example: figma.code`<Header />`,
  imports: ['import { Header } from "@/components/layout/Header"'],
  id: 'header',
  metadata: { nestable: false },
}
