import crudService from '@/services/crud'
import helpers from '@/helpers'
import * as $http from 'axios'

const marketInfo = {
  state: () => ({
    influencers: null,
    news: null,
  }),
  getters: {
    influencers: state => state.influencers,
    news: state => state.news,
  },
  mutations: {
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
  },
}

export default marketInfo