// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15864-579
// source=src/components/ui/ShareButton.tsx
// component=ShareButton
import figma from 'figma'
// "Copied" is the 2-second confirmation after copying the link (desktop without share sheet) – internal state, no prop.
// track: analytics event name (share_club, share_event, share_article).

export default {
  example: figma.code`<ShareButton title={title} locale={locale} track="share_event" />`,
  imports: ['import { ShareButton } from "@/components/ui/ShareButton"'],
  id: 'share-button',
  metadata: { nestable: true },
}
