import { store } from '@/store'

const tooltip = {
  show: ({
    id,
    text,
    showAbove,
    below,
    dark,
  }) => store.commit('addTooltip', {
    id,
    text,
    showAbove,
    below,
    dark,
    bind: true,
  }),
  hide: id => store.commit('removeTooltip', id),
}

export default tooltip