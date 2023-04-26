import { $http } from '@/modules/axios'
import helpers from '@/helpers'

const dashboard = {
  state: () => ({
    dashboards: {
      main: null,
    },
  }),
  getters: {
    dashboards: state => state.dashboards,
  },
  mutations: {
    setDashboards(state, dashboards) {
      Object.keys(dashboards).forEach(key => state.dashboards[key] = dashboards[key])
    },
  },
  actions: {
    async loadDashboardsMain({ commit }) {
      try {
        const main = await $http.get('dashboards/main')

        // 리더보드에서 '워뇨띠' 찾아넣기
        const found = (main.leaderboards || []).find(o => o.name === 'aoa')
        if (found) found.name = 'aoa (워뇨띠)'

        main.leaderboards.sort((a, b) => ['Long', 'Short'].includes(a.side) && b.side === '-' ? -1 : 1)

        // 최근 게시글에서 이미지 추출해서 넣기
        main.posts.data.forEach(async post => {
          post.$$images = helpers.retrieveImagesFromHTML(post.content)
          post.board.$$color = `#${(await helpers.crypto.hash.sha256(post.board.description) || '').substring(0, 6)}`
        })
        commit('setDashboards', { main })
      } catch (e) {
        return Promise.reject(e)
      }
    },
  },
}

export default dashboard