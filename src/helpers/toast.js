import { store as $store } from '@/store'

const showToast = options => {
  if (!options.html || $store.getters.isSSR) return

  options.show = true
  $store.commit('setToast', options)
}

export default {
  success: (html, duration, position) => showToast({ html, duration, type: 'success', position }),
  error: (html, duration, position) => showToast({ html, duration, type: 'error', position }),
  custom: options => showToast(options),
}