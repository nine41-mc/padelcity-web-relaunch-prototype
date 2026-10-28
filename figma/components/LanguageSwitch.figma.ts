// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15205-769
// source=src/components/layout/LanguageSwitch.tsx
// component=LanguageSwitch
// figma=Language Switch
import figma from 'figma'
const instance = figma.selectedInstance
const current = instance.getEnum('Active', { DE: 'de', EN: 'en', PL: 'pl' })

export default {
  example: figma.code`<LanguageSwitch pathname={pathname} current="${current}" label={t.header.language} />`,
  imports: ['import { LanguageSwitch } from "@/components/layout/LanguageSwitch"'],
  id: 'language-switch',
  metadata: { nestable: true },
}
