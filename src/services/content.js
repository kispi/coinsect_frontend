import helpers from '@/helpers'
import { $http } from '@/modules/axios'

const content = {
  realTimePositions: async () => {
    try {
      return await helpers.logic.crypto.decryptAPI(await $http.get('contents/real_time_positions'))
    } catch (e) {
      return Promise.reject(e)
    }
  },
  publicTreasuries: () => $http.get('contents/public_treasuries'),
  news: {
    upbit: () => $http.get('contents/news/upbit'),
  },
}

export default content