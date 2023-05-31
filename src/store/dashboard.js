import { $http } from '@/modules/axios'
import helpers from '@/helpers'

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
        const resp = await $http.get('dashboards/main')

        // 리더보드에서 '워뇨띠' 찾아넣기
        const found = (resp.leaderboards || []).find(o => o.name === 'aoa')
        if (found) found.name = 'aoa (워뇨띠)'

        resp.leaderboards = resp.leaderboards
          .filter(o => o.side !== '-')
          .sort((a, b) => Math.abs(a.dailyChange) < Math.abs(b.dailyChange) ? 1 : -1)

        commit('setDashboardsMain', resp)
      } catch (e) {
        return Promise.reject(e)
      }
    },
  },
}

export default dashboard