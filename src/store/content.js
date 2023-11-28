import contentService from '@/services/content'
import crudService from '@/services/crud'
import helpers from '@/helpers'

const content = {
  state: () => ({
    publicTreasuries: null,
    influencers: null,
    realTimePositions: null,
    pricePredictions: null,
  }),
  getters: {
    publicTreasuries: state => state.publicTreasuries,
    influencers: state => state.influencers,
    news: state => state.news,
    realTimePositions: state => state.realTimePositions,
    pricePredictions: state => state.pricePredictions,
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
    setPricePredictions(state, pricePredictions) {
      state.pricePredictions = pricePredictions
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
        resp.data.reverse()
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
    // MAYBE will be deprecated
    async loadRealTimePositions({ commit }) {
      try {
        const data = await contentService.realTimePositions()
        commit('setRealTimePositions', data)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async loadPricePredictions({ commit }, params = {}) {
      try {
        const o = helpers.qb().base()
        if (params.limit) o.limit(params.limit)
        if (params.offset) o.offset(params.offset)

        const data = await crudService.pricePrediction.all(o.build())
        commit('setPricePredictions', data)
      } catch (e) {
        return Promise.reject(e)
      }
    },
  },
}

export default content