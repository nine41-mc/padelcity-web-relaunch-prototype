// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15116-537
// source=src/components/layout/Logo.tsx
// component=Logo
import figma from 'figma'

// White logotype for dark backgrounds; links to the home page.
export default {
  example: figma.code`<Logo variant="line" locale="de" className="h-8" />`,
  imports: ['import { Logo } from "@/components/layout/Logo"'],
  id: 'logo-line',
  metadata: { nestable: true },
}
