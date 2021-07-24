import helpers from '@/helpers'
import * as $http from 'axios'

const app = {
  state: () => ({
    toast: {
      html: null,
      type: null,
      show: false,
      duration: null,
      action: {
        handler: null,
        label: null,
      },
    },
    modals: [],
    tooltips: [],
    loading: {
      global: null,
    },
    isMobile: null,
    config: null,
    numActiveUsers: null,
    chatFolded: null,
    theme: 'dark',
    settings: {
      sort: {
        column: '$$vol24HBase', // '$$symbol', '$$tradePriceBase', '$$premiumRate', '$$changeRate1D', '$$changeRate52WH', '$$changeRate52WL'
        direction: 'desc',
      },
      documentTitleTicker: 'BTC',
      currency: 'krw',
    },
    windowInnerWidth: null,
    windowInnerHeight: null,
    lastApiCall: {},
    scrollTops: {},  // scrollTop per page
    scrollTop: null, // global scrollTop value
    lazyLoadedScriptUrls: [],
  }),
  getters: {
    toast: state => state.toast,
    modals: state => state.modals,
    tooltips: state => state.tooltips,
    loading: state => state.loading,
    isMobile: state => state.isMobile,
    config: state => state.config,
    numActiveUsers: state => state.numActiveUsers,
    chatFolded: state => state.chatFolded,
    theme: state => state.theme,
    settings: state => state.settings,
    windowInnerWidth: state => state.windowInnerWidth,
    windowInnerHeight: state => state.windowInnerHeight,
    lastApiCall: state => state.lastApiCall,
    scrollTops: state => state.scrollTops,
    scrollTop: state => state.scrollTop,
    lazyLoadedScriptUrls: state => state.lazyLoadedScriptUrls,
  },
  mutations: {
    setToast(state, payload) {
      if (!payload) {
        state.toast = {
          html: null,
          type: null,
          show: false,
          duration: null,
          action: {
            handler: null,
            label: null,
          },
        }
        return
      }

      Object.keys(payload).forEach(key => state.toast[key] = payload[key])
    },
    setChatFolded(state, chatFolded) {
      state.chatFolded = chatFolded
    },
    setConfig(state, config) {
      state.config = config
    },
    setNumActiveUsers(state, numActiveUsers) {
      state.numActiveUsers = numActiveUsers
    },
    setSettings(state, settings) {
      Object.keys(settings).forEach(key => {
        state.settings[key] = settings[key]

        if (key.toLowerCase() === 'theme') {
          const app = document.getElementById('app')
          app.classList.remove(settings[key] === 'dark' ? 'light' : 'dark')
          app.classList.add(settings[key] === 'dark' ? 'dark' : 'light')
        }
      })
      helpers.localStorage.setMeta('settings', state.settings)
    },
    setIsMobile(state) {
      state.windowInnerWidth = window.innerWidth
      state.windowInnerHeight = window.innerHeight
      state.isMobile = state.windowInnerWidth < 768
    },
    // payload: { routeName, scrollTop }
    setScrollTops(state, payload) {
      state.scrollTops[payload.routeName] = payload.scrollTop
    },
    setScrollTop(state, scrollTop) {
      state.scrollTop = scrollTop
    },
    setLoading(state, payload) {
      Object.keys(payload).forEach(key => state.loading[key] = payload[key])
    },
    addModal(state, modal) {
      state.modals.push(modal)
    },
    popModal(state) {
      state.modals.pop()
    },
    removeAllModals(state) {
      state.modals = []
    },
    addTooltip(state, tooltip) {
      state.tooltips.push(tooltip)
    },
    removeTooltip(state, id) {
      const tooltipIdx = state.tooltips.findIndex(t => t.id === id)
      if (tooltipIdx >= 0) state.tooltips.splice(tooltipIdx, 1)
    },
    removeAllTooltips(state) {
      state.tooltips = []
    },
    addLazyLoadedScriptUrl(state, url) {
      state.lazyLoadedScriptUrls.push(url)
    },
  },
  actions: {
    removeToast({ commit }) {
      commit('setToast', null)
    },
    // 앱 뜰 때 필요한 정보들 쭉 콜함
    async loadConfig({ commit, dispatch }) {
      const loadAuthNotRequired = async () => Promise.all([
        dispatch('loadMarkets', 'upbit'),
        dispatch('loadIndices'),
      ])

      commit('setIsMobile')
      commit('setScrollTop', 0)
      dispatch('loadDefaultLocale')

      try {
        await dispatch('loadAuthToken')
      } catch (e) {}

      // 모든 api의 호출 전에 실행
      $http.get('config').then(config => commit('setConfig', config))
      await loadAuthNotRequired()
    },
  },
}

export default app