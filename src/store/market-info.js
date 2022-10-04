import helpers from '@/helpers'
import marketInfoService from '@/services/market-info'
import { $http, $httpNoAuth } from '@/modules/axios'

const marketInfo = {
  state: () => ({
    indices: null,
    crypto: null,
    nasdaq: null,
    kospi: null,
    assetsIncludingMetal: null,
    markets: {
      upbit: [],
      bithumb: [],
      binance: [],
      bybit: [],
    },
    walletStatus: {
      upbit: {},
      bithumb: {},
    },
    orderbooks: {
      upbit: {},
      bybit: {},
      bithumb: {},
    },
    instruments: {
      bybit: {},
    },
    leaderboard: null,
    realTimeTickers: {},
    rawWebsocketInfo: {
      upbit: {},
      bithumb: {},
      binance: {},
    },
    symbols: {},
  }),
  getters: {
    usdKrw: state => state.indices ? state.indices.basePrice : 0,
    indices: state => state.indices,
    crypto: state => state.crypto,
    nasdaq: state => state.nasdaq,
    kospi: state => state.kospi,
    assetsIncludingMetal: state => state.assetsIncludingMetal,
    markets: state => state.markets,
    walletStatus: state => state.walletStatus,
    orderbooks: state => state.orderbooks,
    instruments: state => state.instruments,
    leaderboard: state => state.leaderboard,
    realTimeTickers: state => state.realTimeTickers,
    rawWebsocketInfo: state => state.rawWebsocketInfo,
    symbols: state => state.symbols,
  },
  mutations: {
    setIndices(state, indices) {
      state.indices = indices
    },
    setCrypto(state, crypto) {
      state.crypto = crypto
    },
    setNasdaq(state, nasdaq) {
      state.nasdaq = nasdaq
    },
    setKospi(state, kospi) {
      state.kospi = kospi
    },
    setAssetsIncludingMetal(state, assetsIncludingMetal) {
      state.assetsIncludingMetal = assetsIncludingMetal
    },
    setMarkets(state, markets) {
      Object.keys(markets).forEach(key => state.markets[key] = markets[key])
    },
    setWalletStatus(state, walletStatus) {
      state.walletStatus = walletStatus
    },
    setOrderbook(state, { exchange, market, orderbook }) {
      state.orderbooks[exchange][market] = orderbook
    },
    setInstrument(state, { exchange, market, instrument }) {
      state.instruments[exchange][market] = instrument
    },
    setLeaderboard(state, leaderboard) {
      state.leaderboard = leaderboard
    },
    setRawWebsocketInfo(state, { exchange, market, json }) {
      state.rawWebsocketInfo[exchange][market] = json
    },
    setSymbols(state, symbols) {
      state.symbols = symbols
    },
    initRealTimeTickers(state) {
      state.realTimeTickers = {}
    },
  },
  actions: {
    async loadIndices({ commit }) {
      try {
        commit('setIndices', await marketInfoService.indices())
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async loadNasdaq({ commit }) {
      try {
        commit('setNasdaq', await marketInfoService.nasdaq())
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async loadKospi({ commit }, params) {
      try {
        commit('setKospi', await marketInfoService.kospi(params))
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async loadAssetsIncludingMetal({ commit }) {
      try {
        commit('setAssetsIncludingMetal', await marketInfoService.assetsIncludingMetal())
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async loadCrypto({ commit }, {
      page,
      limit,
      sortBy,
      sortType,
      tagSlugs,
    }) {
      try {
        const params = {
          start: (page - 1) * limit + 1,
          limit,
          sortBy,
          sortType,
          convert: 'USD,BTC',
          cryptoType: 'all',
          tagType: 'all',
          tagSlugs,
          aux: 'ath,atl,high24h,low24h,num_market_pairs,cmc_rank,date_added,max_supply,circulating_supply,total_supply,volume_7d,volume_30d,self_reported_circulating_supply,self_reported_market_cap',
        }
        commit('setLoading', { global: true })
        const { data } = await marketInfoService.crypto(params)
        commit('setCrypto', {
          data: data.cryptoCurrencyList,
          total: parseInt(data.totalCount),
        })
      } catch (e) {
        return Promise.reject(e)
      } finally {
        commit('setLoading', { global: false })
      }
    },
    async loadBaseMarkets({ commit, getters, dispatch }) {
      try {
        const data = await marketInfoService.base({
          baseExchange: getters.settings.baseExchange,
          baseExchangeMarket: getters.settings.baseExchangeMarket,
        })
        if (getters.settings.baseExchange === 'upbit') commit('setMarkets', { upbit: data })
        if (getters.settings.baseExchange === 'bithumb') commit('setMarkets', { bithumb: data })
        dispatch('loadWalletStatus')
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async loadWalletStatus({ commit, getters }) {
      const bEx = getters.settings.baseExchange
      const o = {}
      try {
        if (bEx === 'upbit') {
          const data = await $httpNoAuth.get('https://ccx.upbit.com/api/v1/status/wallet')
          data.forEach(w => o[w.currency] = { d: w.wallet_state !== 'paused' })
        }

        if (bEx === 'bithumb') {
          const { data } = await $httpNoAuth.get('https://api.bithumb.com/public/assetsstatus/ALL')
          Object.keys(data).forEach(key => o[key] = {
            d: data[key].deposit_status === 1,
            w: data[key].withdrawal_status === 1,
          })
        }
      } catch (e) {
        return Promise.reject(e)
      }
      commit('setWalletStatus', { [bEx]: o })
    },
    async loadTargetMarkets({ commit }) {
      if (helpers.canSkipApiCall('loadTargetMarkets')) return

      try {
        const data = await $http.get('market_info/markets')
        commit('setMarkets', data)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async loadSymbols({ commit }) {
      if (helpers.canSkipApiCall('loadSymbols')) return

      try {
        const symbols = await marketInfoService.symbols()
        commit('setSymbols', symbols)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async loadLeaderboard({ commit }) {
      if (helpers.canSkipApiCall('leaderboard')) return

      try {
        commit('setLoading', { global: true })
        const data = await marketInfoService.leaderboard()
        const aoa = data.find(row => row.name === 'aoa')
        if (aoa) aoa.name = 'aoa (워뇨띠)'
        commit('setLeaderboard', data)
      } catch (e) {
        return Promise.reject(e)
      } finally {
        commit('setLoading', { global: false })
      }
    },
  },
}

export default marketInfo