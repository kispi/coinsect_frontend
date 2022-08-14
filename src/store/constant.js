import constantService from '@/services/constant'

const constants = {
  state: () => ({
    wallets: null,
  }),
  getters: {
    wallets: state => state.wallets,
  },
  mutations: {
    setWallets(state, wallets) {
      state.wallets = wallets
    },
  },
  actions: {
    async loadWallets({ commit, getters }) {
      if (getters.wallets) return getters.wallets

      try {
        commit('setWallets', await constantService.wallets())
      } catch (e) {
        return Promise.reject(e)
      }
    },
  },
}

export default constants