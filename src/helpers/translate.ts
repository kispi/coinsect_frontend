import { store } from '@/store'
import json from '@/assets/translations/index.js'

export default (key: string): string => {
  if (typeof key !== 'string') return ''

  const upper = (key || '').toUpperCase()
  const locale = store.getters.settings.locale
  return (json[upper as keyof typeof json] || {})[locale] || key
}