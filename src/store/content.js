import crudService from '@/services/crud'

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
      try {
        const data = await crudService.person.all()
        commit('setInfluencers', data)
      } catch (e) {
        return Promise.reject(e)
      }
    },
  },
}

export default marketInfo