// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15913-669
// source=src/components/modules/PageHero.tsx
// component=PageHero
// figma=Page Hero
import figma from 'figma'
const instance = figma.selectedInstance
// Headline as children with one <Accent> word; image from Contentful (without image: Brandbook gradient).
const align = instance.getEnum('Align', { Left: 'left', Center: 'center' })
const showEyebrow = instance.getBoolean('Eyebrow')
const showLead = instance.getBoolean('Lead')
const showActions = instance.getBoolean('Actions')
const lead = instance.getString('Lead text')
const eyebrowText = instance.findText('Label', { traverseInstances: true })
const eyebrow = eyebrowText && eyebrowText.type === 'TEXT' ? eyebrowText.textContent : ''
const headline = instance.findText('Headline')
const title = headline.type === 'TEXT' ? headline.textContent : ''
const buttons = instance.findConnectedInstances(n => (n.codeConnectId() || '').startsWith('button-'))
const action1 = buttons[0] ? buttons[0].executeTemplate().example : undefined
const action2 = buttons[1] ? buttons[1].executeTemplate().example : undefined

export default {
  example: figma.code`<PageHero${showEyebrow ? figma.code` eyebrow="${eyebrow}"` : ''}${showLead ? figma.code` lead="${lead}"` : ''} image={{ url: "…", alt: "…" }}${align === 'center' ? ' align="center"' : ''}${showActions ? figma.code` actions={<>${action1}${action2}</>}` : ''}>
  ${title}
</PageHero>`,
  imports: ['import { PageHero } from "@/components/modules/PageHero"'],
  id: 'page-hero',
  metadata: { nestable: false },
}
