import { store as $store } from '@/store'

const tooltip = {
  show: tooltip => $store.commit('addTooltip', tooltip),
  hide: id => $store.commit('removeTooltip', id),
}

export default tooltip