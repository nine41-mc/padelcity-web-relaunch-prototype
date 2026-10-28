// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15866-569
// source=src/components/events/EventSignup.tsx
// component=EventSignup
// figma=Event Signup
import figma from 'figma'
// App deeplink + web app link for one event; showLabel renders the small "Anmelden" label above the buttons.

export default {
  example: figma.code`<EventSignup eventId={event.id} locale={locale} size="md" showLabel />`,
  imports: ['import { EventSignup } from "@/components/events/EventSignup"'],
  id: 'event-signup',
  metadata: { nestable: true },
}
