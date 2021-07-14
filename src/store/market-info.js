import marketInfoService from '@/services/market-info'

const marketInfo = {
  state: () => ({
    indices: null,
  }),
  getters: {
    indices: state => state.indices,
  },
  mutations: {
    setIndices(state, indices) {
      state.indices = indices
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
  },
}

export default marketInfo