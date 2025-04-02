import { Module } from 'vuex'
import { RootState } from '.'
import { RealTimePosition, UpbitNews, WhaleAlert } from '@/types'
import { $http } from '@/modules/axios'
import helpers from '@/helpers'

type ResponseDashboard = {
  news: UpbitNews[]
  realTimePositions: {
    data: RealTimePosition[]
    lastUpdate: string
  }
  whaleAlert: {
    data: WhaleAlert[]
    total: number
  }
}

export interface VuexStateDashboard {
  dashboardsMain: ResponseDashboard | null
}

const dashboard: Module<VuexStateDashboard, RootState> = {
  state: () => ({
    dashboardsMain: null,
  }),
  getters: {
    dashboardsMain: state => state.dashboardsMain,
  },
  mutations: {
    setDashboardsMain(state, dashboardsMain: ResponseDashboard) {
      state.dashboardsMain = dashboardsMain
    },
  },
  actions: {
    async loadDashboardsMain({ commit }) {
      try {
        const resp = await helpers.logic.crypto.decryptAPIResponse(await $http.get('dashboards/main')) as ResponseDashboard
        commit('setDashboardsMain', resp)
      } catch (e) {
        return Promise.reject(e)
      }
    },
  },
}

export default dashboard