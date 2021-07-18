import helpers from '@/helpers'
import marketInfoService from '@/services/market-info'
import * as $http from 'axios'

const marketInfo = {
  state: () => ({
    indices: null,
    marketcaps: {
      upbit: null,
      coinmarketcap: null,
    },
    markets: {
      upbit: null,
      bithumb: null,
    },
    realTimeTickers: {},
    symbols: {},
    websockets: {
      upbit: null,
      bithumb: null,
    },
  }),
  getters: {
    usdKrw: state => state.indices ? state.indices.upbitForex.basePrice : 0,
    indices: state => state.indices,
    marketcaps: state => state.marketcaps,
    markets: state => state.markets,
    realTimeTickers: state => state.realTimeTickers,
    symbols: state => state.symbols,
    websockets: state => state.websockets,
  },
  mutations: {
    setIndices(state, indices) {
      state.indices = indices
    },
    setMarketcaps(state, { data, source }) {
      state.marketcaps[source] = data
    },
    setWebsocket(state, market) {
      if (market === 'upbit' && !state.websockets.upbit) {
        state.websockets.upbit = new WebSocket('wss://api.upbit.com/websocket/v1')
        state.websockets.upbit.binaryType = 'arraybuffer'
        return
      }

      if (market === 'binance' && !state.websockets.binance) {
        state.websockets.binance = new WebSocket('wss://stream.binance.com:9443/ws')
        return
      }
    },
    disconnectWebsocket(state, market) {
      if (!state.websockets[market]) return

      state.websockets[market].close()
      state.websockets[market] = null
    },
    setMarkets(state, { exchange, markets, symbols }) {
      state.markets[exchange] = markets
      state.symbols = symbols
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
    async loadMarketcaps({ commit }, source) {
      if (helpers.canSkipApiCall(`loadMarketcaps_${source}`)) return

      try {
        commit('setLoading', { marketcaps: true })
        commit('setMarketcaps', {
          data: await marketInfoService.marketcaps(source),
          source,
        })
      } catch (e) {
        return Promise.reject(e)
      } finally {
        commit('setLoading', { marketcaps: false })
      }
    },
    async loadMarkets({ commit }, exchange) {
      let endpoint
      if (exchange === 'upbit') endpoint = 'https://api.upbit.com/v1/market/all'
      if (exchange === 'bithumb') endpoint = 'https://api.bithumb.com/public/ticker/all_krw'

      try {
        const data = await $http.get(endpoint)
        const symbols = {}
        const markets = data.filter(o => o.market.startsWith('KRW-'))
        markets.forEach(o => {
          const symbol = o.market.split('KRW-')[1]
          o.$$symbol = symbol
          symbols[symbol] = { en: o.english_name, kr: o.korean_name }
        })

        commit('setMarkets', {
          exchange,
          markets,
          symbols,
        })
      } catch (e) {
        return Promise.reject(e)
      }
    },
  },
}

export default marketInfo