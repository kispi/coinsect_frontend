import { Wallet } from '@/types'
import { Module } from 'vuex'
import { RootState } from '.'
import constantService from '@/services/constant'

export interface VuexStateConstant {
  wallets: Wallet[] | null
}

const constants: Module<VuexStateConstant, RootState> = {
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