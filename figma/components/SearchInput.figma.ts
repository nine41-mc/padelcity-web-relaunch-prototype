// url=https://www.figma.com/design/n3QOz0mQUCyzzVmxX4nKw3/PadelCity-Website-Relaunch?node-id=15205-698
// source=src/components/ui/SearchInput.tsx
// component=SearchInput
// figma=Input / Search
import figma from 'figma'
const instance = figma.selectedInstance
const placeholder = instance.getString('Value')
// Default/Filled/Focus are runtime states (Filled shows the clear button).

export default {
  example: figma.code`<SearchInput id={searchId} value={query} onChange={setQuery} placeholder="${placeholder}" clearLabel="Suche löschen" />`,
  imports: ['import { SearchInput } from "@/components/ui/SearchInput"'],
  id: 'search-input',
  metadata: { nestable: true },
}
