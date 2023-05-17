import { store } from '@/store'
import json from '@/assets/translations/index.js'

export default key => {
  if (typeof key !== 'string') return

  const upper = (key || '').toUpperCase()
  const locale = store.getters.settings.locale
  return (json[upper] || {})[locale] || key
}