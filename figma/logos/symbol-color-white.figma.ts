// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15116-546
// source=public/brand/symbol-color-white.svg
// component=img
import figma from 'figma'

// Brand symbol, white variant (decorative).
export default {
  example: figma.code`<img src={asset("/brand/symbol-color-white.svg")} alt="" />`,
  imports: ['import { asset } from "@/lib/asset"'],
  id: 'logo-symbol-color-white',
  metadata: { nestable: true },
}
