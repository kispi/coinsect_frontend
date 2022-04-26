import crudService from '@/services/crud'
import helpers from '@/helpers'
import { $http } from '@/modules/axios'

const marketInfo = {
  state: () => ({
    publicTreasuries: null,
    influencers: null,
    news: null,
    realTimePositions: null,
  }),
  getters: {
    publicTreasuries: state => state.publicTreasuries,
    influencers: state => state.influencers,
    news: state => state.news,
    realTimePositions: state => state.realTimePositions,
  },
  mutations: {
    setPublicTreasuries(state, publicTreasuries) {
      state.publicTreasuries = publicTreasuries
    },
    setInfluencers(state, influencers) {
      state.influencers = influencers
    },
    setNews(state, news) {
      state.news = news
    },
    setRealTimePositions(state, realTimePositions) {
      state.realTimePositions = realTimePositions
    },
  },
  actions: {
    async loadInfluencers({ commit }) {
      if (helpers.canSkipApiCall('loadInfluencers', 60)) return

      try {
        const resp = await crudService.person.all()
        resp.data.forEach(o => {
          try {
            o.$$description = JSON.parse(o.description)
            o.$$bio = JSON.parse(o.bio)
          } catch (e) {}
        })
        commit('setInfluencers', resp)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async loadNews({ commit }) {
      try {
        const data = await $http.get('https://api-manager.upbit.com/api/v1/coin_news')
        commit('setNews', data)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async loadPublicTreasuries({ commit }) {
      try {
        commit('setLoading', { global: true })
        const data = await $http.get('contents/public_treasuries')
        commit('setPublicTreasuries', data)
      } catch (e) {
        return Promise.reject(e)
      } finally {
        commit('setLoading', { global: false })
      }
    },
    async loadRealTimePositions({ commit }) {
      try {
        const data = await $http.get('contents/real_time_positions')
        commit('setRealTimePositions', data)
      } catch (e) {
        return Promise.reject(e)
      }
    },
  },
}

export default marketInfo