import type { MilkdownPlugin } from '@milkdown/ctx'

import { listItemBlockView } from './view'

export * from './view'

export const listItemBlockComponent: MilkdownPlugin[] = [
  listItemBlockView,
]