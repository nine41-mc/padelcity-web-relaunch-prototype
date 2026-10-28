// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15205-832
// source=src/components/modules/NewsletterSignup.tsx
// component=NewsletterSignup
// figma=Newsletter
import figma from 'figma'
// Default/Success are runtime states of the form (success after submit).
// One newsletter for the whole site (footer): title and text come from the dictionary, not from props.
// `id="newsletter"` is the anchor "Benachrichtige mich" on planned clubs jumps to.

export default {
  example: figma.code`<NewsletterSignup locale="de" id="newsletter" />`,
  imports: ['import { NewsletterSignup } from "@/components/modules/NewsletterSignup"'],
  id: 'newsletter',
  metadata: { nestable: false },
}
