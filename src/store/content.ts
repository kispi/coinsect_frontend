import { Module } from 'vuex'
import { Person, RealTimePosition } from '@/types'
import { RootState } from '.'
import contentService from '@/services/content'
import crudService from '@/services/crud'
import helpers from '@/helpers'

export interface VuexStateContent {
  influencers: Person[] | null
  realTimePositions: RealTimePosition[] | null
}

const content: Module<VuexStateContent, RootState> = {
  state: () => ({
    publicTreasuries: null,
    influencers: null,
    realTimePositions: null,
  }),
  getters: {
    influencers: state => state.influencers,
    realTimePositions: state => state.realTimePositions,
  },
  mutations: {
    setInfluencers(state, influencers: Person[]) {
      state.influencers = influencers
    },
    setRealTimePositions(state, realTimePositions: RealTimePosition[]) {
      state.realTimePositions = realTimePositions
    },
  },
  actions: {
    async loadInfluencers({ commit }) {
      if (helpers.canSkipApiCall('loadInfluencers', 60)) return

      try {
        // @ts-ignore
        const resp = await crudService.person.all() as { data: Person[] }
        resp.data.forEach((o: Person) => {
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

export default content