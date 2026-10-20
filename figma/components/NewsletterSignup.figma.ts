// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15205-832
// source=src/components/modules/NewsletterSignup.tsx
// component=NewsletterSignup
import figma from 'figma'
const instance = figma.selectedInstance
const textOf = (layer: string) => {
  const t = instance.findText(layer)
  return t.type === 'TEXT' ? t.textContent : ''
}
// Default/Success are runtime states of the form (success after submit).
const title = textOf('Title')
const text = textOf('Text')

export default {
  example: figma.code`<NewsletterSignup locale="de" title="${title}" text="${text}" />`,
  imports: ['import { NewsletterSignup } from "@/components/modules/NewsletterSignup"'],
  id: 'newsletter',
  metadata: { nestable: false },
}
