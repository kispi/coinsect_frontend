import $store from '@/store'

const tooltip = {
  show: ({ id, text, showAbove }) => $store.commit('addTooltip', { id, text, showAbove, bind: true }),
  hide: id => $store.commit('removeTooltip', id),
}

export default tooltip