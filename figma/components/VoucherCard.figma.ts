// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15210-595
// source=src/components/brand/VoucherCard.tsx
// component=VoucherCard
import figma from 'figma'
const instance = figma.selectedInstance
const label = instance.getString('Label')
const amount = instance.getString('Amount')

export default {
  example: figma.code`<VoucherCard label="${label}" amount="${amount}" aria="${label} – ${amount}" />`,
  imports: ['import { VoucherCard } from "@/components/brand/VoucherCard"'],
  id: 'voucher-card',
  metadata: { nestable: true },
}
