// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15210-399
// source=src/components/brand/ArticleCard.tsx
// component=ArticleCard
import figma from 'figma'
const instance = figma.selectedInstance
// large = Magazin hub variant (image 16:10); the library tile is the regular size.

export default {
  example: figma.code`<ArticleCard article={article} locale="de" />`,
  imports: ['import { ArticleCard } from "@/components/brand/ArticleCard"'],
  id: 'article-card',
  metadata: { nestable: false },
}
