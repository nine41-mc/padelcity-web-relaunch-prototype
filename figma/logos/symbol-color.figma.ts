// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15116-543
// source=public/brand/symbol-color.svg
// component=img
import figma from 'figma'

// Brand symbol in the gradient (decorative, e.g. voucher card).
export default {
  example: figma.code`<img src={asset("/brand/symbol-color.svg")} alt="" />`,
  imports: ['import { asset } from "@/lib/asset"'],
  id: 'logo-symbol-color',
  metadata: { nestable: true },
}
