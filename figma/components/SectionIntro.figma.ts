// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15205-808
// source=src/components/brand/SectionIntro.tsx
// component=SectionIntro
import figma from 'figma'
const instance = figma.selectedInstance
const textOf = (layer: string) => {
  const t = instance.findText(layer)
  return t.type === 'TEXT' ? t.textContent : ''
}
// Wrap the one accent word of the title in <Accent>…</Accent> (Good Brush, Optic Yellow).
const align = instance.getEnum('Align', { Left: 'left', Center: 'center' })
const lead = instance.getString('Lead')
const showEyebrow = instance.getBoolean('Eyebrow')
const showActions = instance.getBoolean('Actions')
const eyebrowText = instance.findText('Label', { traverseInstances: true })
const eyebrow = eyebrowText && eyebrowText.type === 'TEXT' ? eyebrowText.textContent : ''
const title = textOf('Headline')
const buttons = instance.findConnectedInstances(n => (n.codeConnectId() || '').startsWith('button-'))
const action1 = buttons[0] ? buttons[0].executeTemplate().example : undefined
const action2 = buttons[1] ? buttons[1].executeTemplate().example : undefined

export default {
  example: figma.code`<SectionIntro${showEyebrow ? figma.code` eyebrow="${eyebrow}"` : ''} title={<>${title}</>} lead="${lead}" align="${align}"${showActions ? figma.code` actions={<>${action1}${action2}</>}` : ''} />`,
  imports: ['import { SectionIntro } from "@/components/brand/SectionIntro"'],
  id: 'section-intro',
  metadata: { nestable: false },
}
