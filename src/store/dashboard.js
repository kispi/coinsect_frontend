import helpers from '@/helpers'
import { $http } from '@/modules/axios'

const dashboard = {
  state: () => ({
    dashboardsMain: null,
  }),
  getters: {
    dashboardsMain: state => state.dashboardsMain,
  },
  mutations: {
    setDashboardsMain(state, dashboardsMain) {
      state.dashboardsMain = dashboardsMain
    },
  },
  actions: {
    async loadDashboardsMain({ commit }) {
      try {
        const resp = await helpers.logic.crypto.decryptAPIResponse(await $http.get('dashboards/main'))
        commit('setDashboardsMain', resp)
      } catch (e) {
        return Promise.reject(e)
      }
    },
  },
}

export default dashboard