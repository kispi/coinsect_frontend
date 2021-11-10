import json from '@/assets/translations/index.js'

const translation = {
  state: () => ({
    translation: {
      locale: 'kr',
      texts: json,
    },
  }),
  getters: {
    translation: state => state.translation,
  },
  mutations: {
    setLocale(state, locale) {
      if (!locale) return

      state.translation.locale = locale
      window.localStorage.setItem('locale', locale)
    },
  },
  actions: {
    loadDefaultLocale({ commit }) {
      const supportedLocales = ['kr', 'en']
      const storedLocale = window.localStorage.getItem('locale')
      const locale = supportedLocales.find(locale => locale === storedLocale) || 'en'
      commit('setLocale', locale)
    },
  },
}

export default translation