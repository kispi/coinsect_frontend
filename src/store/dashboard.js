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
        if (resp.leaderboards) {
          // 리더보드에서 '워뇨띠' 찾아넣기
          const found = (resp.leaderboards || []).find(o => o.name === 'aoa')
          if (found) found.name = 'aoa (워뇨띠)'

          resp.leaderboards = resp.leaderboards
            .sort((a, b) => a.profit < b.profit ? 1 : -1)
            .slice(0, 8)
        }

        if (resp.recentPosts) await helpers.post.populateRenderablePosts(resp.recentPosts.data)
        commit('setDashboardsMain', resp)
      } catch (e) {
        return Promise.reject(e)
      }
    },
  },
}

export default dashboard