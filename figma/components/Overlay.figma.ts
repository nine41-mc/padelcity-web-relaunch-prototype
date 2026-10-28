// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15868-639
// source=src/components/ui/Overlay.tsx
// component=Overlay
import figma from 'figma'
const instance = figma.selectedInstance
const title = instance.getString('Title')
const meta = instance.getString('Meta')
const showBadge = instance.getBoolean('Show badge')
const badge = instance.getString('Badge')

export default {
  example: figma.code`<Overlay
  open={open}
  onClose={onClose}
  title="${title}"
  meta="${meta}"
  image={image}
  imageAlt=""${showBadge ? `\n  badge={<span>${badge}</span>}` : ''}
  closeLabel={labels.close}
>
  <OverlaySection title={labels.contactTitle}>{content}</OverlaySection>
</Overlay>`,
  imports: ['import { Overlay, OverlaySection } from "@/components/ui/Overlay"'],
  id: 'overlay',
  metadata: { nestable: false },
}
