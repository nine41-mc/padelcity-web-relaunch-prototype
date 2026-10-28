// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15866-585
// source=src/components/events/EventFacts.tsx
// component=EventSignupCard
// figma=Event Signup Card
import figma from 'figma'
const instance = figma.selectedInstance
// Children are FactRows (format, deadline, max. participants, free places – only those the APL delivers).
const price = instance.getString('Price')
const note = instance.getString('Note')
const showNote = instance.getBoolean('Show price note')

export default {
  example: figma.code`<EventSignupCard
  price="${price}"${showNote ? '\n  priceNote={t.detail.perPerson}' : ''}
  signup={<EventSignup eventId={event.id} locale={locale} size="md" showLabel />}
  note="${note}"
>
  <FactRow icon={<Users className="size-5" />} label={t.detail.format}>{format}</FactRow>
  <FactRow icon={<Clock className="size-5" />} label={t.detail.deadline}>{deadline}</FactRow>
</EventSignupCard>`,
  imports: [
    'import { EventSignupCard, FactRow } from "@/components/events/EventFacts"',
    'import { EventSignup } from "@/components/events/EventSignup"',
    'import { Clock, Users } from "lucide-react"',
  ],
  id: 'event-signup-card',
  metadata: { nestable: false },
}
