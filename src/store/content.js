import contentService from '@/services/content'
import crudService from '@/services/crud'
import helpers from '@/helpers'

const marketInfo = {
  state: () => ({
    publicTreasuries: null,
    influencers: null,
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
    async loadPublicTreasuries({ commit }) {
      try {
        commit('setLoading', { global: true })
        const data = await contentService.publicTreasuries()
        commit('setPublicTreasuries', data)
      } catch (e) {
        return Promise.reject(e)
      } finally {
        commit('setLoading', { global: false })
      }
    },
    async loadRealTimePositions({ commit }) {
      try {
        const data = await contentService.realTimePositions()
        commit('setRealTimePositions', data)
      } catch (e) {
        return Promise.reject(e)
      }
    },
  },
}

export default marketInfo