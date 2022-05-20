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
    modals: [],
    tooltips: [],
    loading: {
      global: null,
    },
    websocketConnections: {
      chat: null,
    },
    isMobile: null,
    config: null,
    numActiveUsers: null,
    notifications: null,
    settings: {
      blockedUsers: {},
      locale: 'kr',
      sort: {
        column: '$$vol24HBase', // '$$symbol', '$$tradePriceBase', '$$premiumRate', '$$changeRate1D', '$$changeRate52WH', '$$changeRate52WL'
        direction: 'desc',
      },
      sortInterval: 5000, // Number (ms)
      theme: 'dark',
      documentTitleTicker: 'BTC',
      currency: 'krw',
      filter: 'all', // 'favorites'
      tradingview: {
        home: true,
        realTimePositions: true,
      },
      tradingviewSymbol: 'BITSTAMP:BTCUSD',
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
      newsProvider: 'upbit', // 'upbit' || 'coinness_feed' || 'coinness_article'
      chatFolded: false,
      chatSizeMax: false,
      chatDing: true,
      chatTransparent: false,
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
    websocketConnections: state => state.websocketConnections,
    isMobile: state => state.isMobile,
    config: state => state.config,
    numActiveUsers: state => state.numActiveUsers,
    notifications: state => state.notifications,
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
    setConfig(state, config) {
      state.config = config
    },
    setNumActiveUsers(state, numActiveUsers) {
      state.numActiveUsers = numActiveUsers
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
    setWebsocketConnections(state, websocketConnections) {
      Object.keys(websocketConnections).forEach(key => state.websocketConnections[key] = websocketConnections[key])
    },
    addModal(state, modal) {
      state.modals.push(modal)
    },
    popModal(state, modal) {
      const idx = state.modals.findIndex(m => m === modal)
      if (idx >= 0) delete state.modals[idx]

      if (state.modals.filter(m => m).length === 0) state.modals = []
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
    async loadNotifications({ commit }) {
      const o = helpers.qb().sort('id').order('desc')

      try {
        const data = await $http.get('notifications', { params: o.build() })
        commit('setNotifications', data)
      } catch (e) {}
    },
    // 앱 뜰 때 필요한 정보들 쭉 콜함
    async bootstrap({ commit, dispatch }) {
      const loadAuthNotRequired = async () => Promise.all([
        dispatch('loadTargetMarkets'),
        dispatch('loadSymbols'),
        dispatch('loadNotifications'),
      ])

      commit('setIsMobile')
      commit('setScrollTop', 0)

      try {
        await dispatch('loadAuthToken')
      } catch (e) {}

      $http.get('config').then(data => commit('setConfig', data))
      await loadAuthNotRequired()
    },
  },
}

export default app