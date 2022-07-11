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
    async loadRichlist({ commit }) {
      try {
        const data = await onchainService.richlist.bitcoin()
        commit('setRichlist', { key: 'bitcoin', value: data })
      } catch (e) {
        return Promise.reject(e)
      }
    },
  },
}

export default onchain