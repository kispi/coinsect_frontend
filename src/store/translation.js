import json from '@/assets/translations/index.js'

const supportedLocales = ['en']
let locale = 'en'
let storedLocale = window.localStorage.getItem('locale')
if (supportedLocales.indexOf(storedLocale) !== -1) {
  locale = storedLocale
} else {
  window.localStorage.setItem('locale', locale)
}

const translation = {
  state: () => ({
    translation: {
      locale: 'en',
      texts: json,
    },
  }),
  getters: {
    translation: state => state.translation,
  },
  actions: {
    setLocale({ commit }, payload) {
      window.localStorage.setItem('locale', payload)
      return commit('setTranslation', {
        locale: payload
      })
    },
  },
  mutations: {
    setTranslation(state, payload) {
      if (!payload) {
        return
      }
  
      if (payload.locale !== undefined) {
        state.translation.locale = payload.locale
        window.localStorage.setItem('locale', payload.locale)
      }
    },
  }
}

export default translation