// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15972-93
// source=src/components/forms/Consent.tsx
// component=Consent
// figma=Consent
import figma from 'figma'
const instance = figma.selectedInstance
// The link to the privacy policy and the required star come from the component; the text defaults to the lead-form copy.
const checked = instance.getEnum('Checked', { true: true, false: false })

export default {
  example: figma.code`<Consent locale={locale} id={id} checked={${checked}} onChange={onChange} />`,
  imports: ['import { Consent } from "@/components/forms/Consent"'],
  id: 'consent',
  metadata: { nestable: true },
}
