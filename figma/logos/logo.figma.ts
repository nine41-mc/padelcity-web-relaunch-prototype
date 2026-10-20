// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15116-534
// source=public/brand/logo.svg
// component=img
import figma from 'figma'

// Coloured logotype (light backgrounds; in code only as file, e.g. structured data).
export default {
  example: figma.code`<img src={asset("/brand/logo.svg")} alt="PadelCity" />`,
  imports: ['import { asset } from "@/lib/asset"'],
  id: 'logo-logo',
  metadata: { nestable: true },
}
