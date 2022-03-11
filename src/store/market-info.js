import helpers from '@/helpers'
import marketInfoService from '@/services/market-info'
import * as $http from 'axios'

const marketInfo = {
  state: () => ({
    indices: null,
    marketcaps: null,
    markets: {
      upbit: [],
      bithumb: [],
      binance: [],
      bybit: [],
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
    marketcaps: state => state.marketcaps,
    markets: state => state.markets,
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
    setMarketcaps(state, marketcaps) {
      state.marketcaps = marketcaps
    },
    setMarkets(state, markets) {
      Object.keys(markets).forEach(key => state.markets[key] = markets[key])
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
    async loadMarketcaps({ commit }, {
      page,
      limit,
      sortBy,
      sortType,
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
          audited: false,
          aux: 'ath,atl,high24h,low24h,num_market_pairs,cmc_rank,date_added,max_supply,circulating_supply,total_supply,volume_7d,volume_30d,self_reported_circulating_supply,self_reported_market_cap',
        }
        const { data } = await marketInfoService.marketcaps(params)
        commit('setMarketcaps', {
          data: data.cryptoCurrencyList,
          total: parseInt(data.totalCount),
        })
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async loadBaseMarkets({ commit, getters }) {
      const bEx = getters.settings.baseExchange
      if (helpers.canSkipApiCall(`loadBaseMarkets_${bEx}`)) return

      const endpoint = (() => {
        if (bEx === 'upbit') return 'https://api.upbit.com/v1/market/all'
        if (bEx === 'bithumb') return 'https://api.bithumb.com/public/ticker/all_krw'
      })()

      try {
        const data = await $http.get(endpoint)
        if (bEx === 'upbit') {
          const upbit = data.filter(o => o.market.startsWith('KRW-')).map(o => ({
            ...o,
            $$symbol: o.market.split('-')[1]
          }))
          commit('setMarkets', { upbit })
        }
        if (bEx === 'bithumb') {
          const bithumb = Object.keys(data['data']).filter(symbol => symbol !== 'date').map($$symbol => ({
            $$symbol,
            ...data['data'][$$symbol]
          }))
          commit('setMarkets', { bithumb })
        }
      } catch (e) {
        return Promise.reject(e)
      }
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