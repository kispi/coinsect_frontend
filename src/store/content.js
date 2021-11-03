import crudService from '@/services/crud'
import helpers from '@/helpers'

const marketInfo = {
  state: () => ({
    influencers: null,
  }),
  getters: {
    influencers: state => state.influencers,
  },
  mutations: {
    setInfluencers(state, influencers) {
      state.influencers = influencers
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
  },
}

export default marketInfo