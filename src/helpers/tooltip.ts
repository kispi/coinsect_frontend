import { TooltipOptions } from '@/types'
import { store } from '@/store'

const tooltip = {
  show: (tooltipOptions: TooltipOptions) => store.commit('addTooltip', { ...tooltipOptions, bind: true }),
  hide: (id: string) => store.commit('removeTooltip', id),
}

export default tooltip