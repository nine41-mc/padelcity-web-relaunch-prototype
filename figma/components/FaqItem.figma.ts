// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15122-247
// source=src/components/ui/FaqItem.tsx
// component=FaqItem
import figma from 'figma'
const instance = figma.selectedInstance
const question = instance.getString('Question')
const open = instance.getEnum('Open', { true: true, false: false })

export default {
  example: figma.code`<FaqGroup>
  <FaqItem question="${question}"${open ? ' defaultOpen' : ''}>
    <p>{answer}</p>
  </FaqItem>
</FaqGroup>`,
  imports: ['import { FaqGroup, FaqItem } from "@/components/ui/FaqItem"'],
  id: 'faq-item',
  metadata: { nestable: false },
}
