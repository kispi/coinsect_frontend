import crudService from '@/services/crud'
import helpers from '@/helpers'
import * as $http from 'axios'

const marketInfo = {
  state: () => ({
    publicTreasuries: null,
    influencers: null,
    news: null,
  }),
  getters: {
    publicTreasuries: state => state.publicTreasuries,
    influencers: state => state.influencers,
    news: state => state.news,
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
  },
  actions: {
    async loadInfluencers({ commit }) {
      if (helpers.canSkipApiCall('loadInfluencers', 60)) return

      try {
        const resp = await crudService.person.all()
        resp.data.forEach(o => {
          o.$$key = (o.name || '').toLowerCase().replace(/ /g, '-')
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
  },
}

export default marketInfo