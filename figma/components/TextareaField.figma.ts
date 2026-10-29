// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15972-55
// source=src/components/forms/Field.tsx
// component=TextareaField
// figma=Input / Textarea
import figma from 'figma'
const instance = figma.selectedInstance
// "Value" is the placeholder in the design. In State=Error the message line is the error, otherwise the hint.
const label = instance.getString('Label')
const placeholder = instance.getString('Value')
const message = instance.getBoolean('Show Message') ? instance.getString('Message') : ''
const error = instance.getEnum('State', { Default: false, Error: true })
const required = instance.getBoolean('Required')
const optional = instance.getBoolean('Optional')

export default {
  example: figma.code`<TextareaField id={id} label="${label}"${required ? ' required' : ''}${optional ? ' optional="(optional)"' : ''} placeholder="${placeholder}"${message ? (error ? figma.code` error="${message}"` : figma.code` hint="${message}"`) : ''} value={value} onChange={onChange} />`,
  imports: ['import { TextareaField } from "@/components/forms/Field"'],
  id: 'textarea-field',
  metadata: { nestable: true },
}
