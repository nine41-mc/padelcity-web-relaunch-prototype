// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15972-65
// source=src/components/forms/ChoiceCards.tsx
// component=ChoiceCards
// figma=Choice Card
import figma from 'figma'
const instance = figma.selectedInstance
// One card stands for one option of the radio group; the code renders the whole group with its legend.
const title = instance.getString('Title')
const text = instance.getString('Text')
const error = instance.getEnum('State', { Default: false, Selected: false, Error: true })

export default {
  example: figma.code`<ChoiceCards name={name} legend={legend} options={[{ value: "…", title: "${title}", text: "${text}" }]} value={value} onChange={setValue}${error ? ' error={error}' : ''} />`,
  imports: ['import { ChoiceCards } from "@/components/forms/ChoiceCards"'],
  id: 'choice-cards',
  metadata: { nestable: true },
}
