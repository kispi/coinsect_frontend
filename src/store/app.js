import helpers from '@/helpers'
import { $http } from '@/modules/axios'

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
    snackbars: [],
    modals: [],
    tooltips: [],
    loading: {
      global: null,
    },
    isMobile: null,
    config: null,
    notifications: null,
    settings: {
      blockedUsers: {},
      locale: 'kr',
      dockFolded: false,
      sort: {
        column: '$$vol24HBase', // '$$symbol', '$$tradePriceBase', '$$premiumRate', '$$changeRate1D', '$$changeRate52WH', '$$changeRate52WL'
        direction: 'desc',
      },
      sortInterval: 5000, // Number (ms)
      theme: 'dark',
      documentTitleTicker: 'BTC',
      currency: 'krw',
      filter: 'all', // 'favorites'
      tradingview: true,
      chartFullWidth: false,
      chartTool: true,
      baseExchange: 'upbit', // 'upbit' || 'bithumb'
      baseExchangeMarket: 'krw', // 'krw' || 'btc' || 'usdt'...
      targetExchange: 'binance',
      favorites: {},
      portfolio: {},
      salary: {
        symbol: 'BTC',
        preTax: 22000000,
        numFamily: 1,
        nonTax: 1200000,
      },
      sentimentVoted: false,
      chatFolded: false,
      chatSizeMax: false,
      chatDing: false,
      chatTransparent: false,
      chatOverlayNewMessage: true,
      chatSkin: 'basic',
    },
    showNavigation: null,
    charts: [
      { symbol: 'BINANCE:BTCUSDT', interval: 15 },
      { symbol: 'FOREXCOM:NSXUSD', interval: 15 },
    ],
    chatStats: {},
    chatUsers: null, // 웹소켓 커넥션이 아니고 접속자 정보임
    windowInnerWidth: null,
    windowInnerHeight: null,
    documentVisible: true, // 접속 직후에는 true
    lastApiCall: {},
    scrollTop: null, // global scrollTop value
    stickyAppBodyHeight: null,
    lazyLoadedScriptUrls: [],
  }),
  getters: {
    toast: state => state.toast,
    snackbars: state => state.snackbars,
    modals: state => state.modals,
    tooltips: state => state.tooltips,
    loading: state => state.loading,
    isMobile: state => state.isMobile,
    config: state => state.config,
    chatStats: state => state.chatStats,
    chatUsers: state => state.chatUsers,
    notifications: state => state.notifications,
    settings: state => state.settings,
    showNavigation: state => state.showNavigation,
    charts: state => state.charts,
    windowInnerWidth: state => state.windowInnerWidth,
    windowInnerHeight: state => state.windowInnerHeight,
    documentVisible: state => state.documentVisible,
    lastApiCall: state => state.lastApiCall,
    scrollTop: state => state.scrollTop,
    stickyAppBodyHeight: state => state.stickyAppBodyHeight,
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
    setConfig(state, config) {
      state.config = config
    },
    setChatStats(state, chatStats) {
      state.chatStats = chatStats
    },
    setChatUsers(state, message) {
      state.chatUsers = (message || {}).meta
    },
    setNotifications(state, notifications) {
      state.notifications = notifications
    },
    setSettings(state, settings) {
      Object.keys(settings).forEach(key => {
        state.settings[key] = settings[key]

        if (key.toLowerCase() === 'theme') {
          const app = document.getElementById('app')
          app.classList.remove(settings[key] === 'dark' ? 'light' : 'dark')
          app.classList.add(settings[key] === 'dark' ? 'dark' : 'light')
        }

        if (key === 'locale') {
          const supportedLocales = ['en', 'kr']
          if (!supportedLocales.includes(settings[key])) state.settings[key] = 'kr'
        }
      })
      helpers.localStorage.setMeta('settings', state.settings)
    },
    setShowNavigation(state, showNavigation) {
      state.showNavigation = showNavigation
    },
    setCharts(state, charts) {
      state.charts = charts
      helpers.localStorage.setMeta('charts', state.charts)
    },
    setIsMobile(state) {
      state.windowInnerWidth = window.innerWidth
      state.windowInnerHeight = window.innerHeight
      state.isMobile = state.windowInnerWidth < 768
    },
    setDocumentVisible(state, visible) {
      state.documentVisible = visible
      if (visible) helpers.useFaviconWithUnreads(false)
    },
    setScrollTop(state, scrollTop) {
      state.scrollTop = scrollTop

      if (state.windowInnerWidth < 1200) return

      state.stickyAppBodyHeight = `calc(${document.getElementsByClassName('app-body')[0].clientHeight}px - var(--app-header-height) - 80px)`
    },
    setLoading(state, payload) {
      Object.keys(payload).forEach(key => state.loading[key] = payload[key])
    },
    addSnackbar(state, snackbar) {
      snackbar.id = helpers.logic.generateUUIDV4()
      state.snackbars.push(snackbar)
    },
    removeSnackbar(state, snackbar) {
      const idx = state.snackbars.findIndex(s => s.id === snackbar.id)
      if (idx >= 0) state.snackbars.splice(idx, 1)

      if (state.snackbars.length === 0) state.snackbars = []
    },
    addModal(state, modal) {
      modal.id = helpers.logic.generateUUIDV4()
      state.modals.push(modal)
    },
    removeModal(state, modal) {
      const idx = state.modals.findIndex(m => m.id === modal.id)
      if (idx >= 0) state.modals.splice(idx, 1)

      if (state.modals.length === 0) state.modals = []
    },
    removeAllModals(state) {
      state.modals = []
    },
    addTooltip(state, tooltip) {
      if (state.tooltips.find(t => t.id === tooltip.id)) return

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
    async loadNotifications({ commit }, page) {
      const limit = 10
      const o = helpers.qb().sort('id').order('desc').limit(limit).offset((page || 0) * limit)

      try {
        const data = await $http.get('notifications', { params: o.build() })
        commit('setNotifications', data)
      } catch (e) {}
    },
    async loadAuthNotRequired({ dispatch }) {
      dispatch('loadTargetMarkets')
      dispatch('loadSymbols')
      dispatch('loadNotifications')
      dispatch('loadBoards')
    },
    async loadAuthRequired({ getters, dispatch }) {
      if (!getters.header) return

      await dispatch('loadMe')
    },
    // 앱 뜰 때 필요한 정보들 쭉 콜함
    async bootstrap({ commit, dispatch }) {
      commit('setIsMobile')
      commit('setScrollTop', 0)

      try {
        await dispatch('loadAuthToken')
      } catch (e) {}

      $http.get('config').then(data => commit('setConfig', data))
      await dispatch('loadAuthNotRequired')
      await dispatch('loadAuthRequired')
    },
  },
}

export default app