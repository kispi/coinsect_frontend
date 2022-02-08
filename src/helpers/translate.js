import { store as $store } from '@/store'

export default key => {
  if (typeof key !== 'string') return

  const upper = (key || '').toUpperCase()
  const locale = $store.getters.translation.locale
  return ($store.getters.translation.texts[upper] || {})[locale] || key
}