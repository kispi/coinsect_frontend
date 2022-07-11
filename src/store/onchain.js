import onchainService from '@/services/onchain'

const onchain = {
  state: () => ({
    richlist: {
      bitcoin: null,
    },
  }),
  getters: {
    richlist: state => state.richlist,
  },
  mutations: {
    setRichlist(state, payload) {
      state.richlist[payload.key] = payload.value
    },
  },
  actions: {
    async loadRichlist({ commit }, key) {
      try {
        const data = await onchainService.richlist[key]()
        commit('setRichlist', { key, value: data })
      } catch (e) {
        return Promise.reject(e)
      }
    },
  },
}

export default onchain