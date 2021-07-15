import helpers from '@/helpers'
import marketInfoService from '@/services/market-info'

const marketInfo = {
  state: () => ({
    indices: null,
    marketcaps: {
      upbit: null,
      coinmarketcap: null,
    },
  }),
  getters: {
    usdKrw: state => state.indices.upbitForex.basePrice,
    indices: state => state.indices,
    marketcaps: state => state.marketcaps,
  },
  mutations: {
    setIndices(state, indices) {
      state.indices = indices
    },
    setMarketcaps(state, { data, source }) {
      state.marketcaps[source] = data
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
    }
  },
}

export default marketInfo