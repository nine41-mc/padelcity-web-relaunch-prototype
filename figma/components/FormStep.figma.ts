// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15972-30
// source=src/components/forms/FormStep.tsx
// component=FormStep
// figma=Form Step
import figma from 'figma'
const instance = figma.selectedInstance
const number = instance.getString('Number')
const title = instance.getString('Title')

export default {
  example: figma.code`<FormStep number={${number}} title="${title}" />`,
  imports: ['import { FormStep } from "@/components/forms/FormStep"'],
  id: 'form-step',
  metadata: { nestable: true },
}
