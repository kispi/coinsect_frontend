import { store } from '@/store'
import { ToastOptions } from '@/types'

const showToast = (options: ToastOptions) => {
  if (!options.html || store.getters.isSSR) return

  options.show = true
  if (options.html) options.html = options.html.trim()
  store.commit('setToast', options)
}

export default {
  success: (html: string, duration?: number) => showToast({ html, duration, type: 'success' }),
  error: (html: string, duration?: number) => showToast({ html, duration, type: 'error' }),
  custom: (options: ToastOptions) => showToast(options),
}