import { RealTimePosition, UpbitNews } from '@/types'
import { $http } from '@/modules/axios'
import helpers from '@/helpers'

const content = {
  realTimePositions: async () => {
    try {
      return await helpers.logic.crypto.decryptAPIResponse(await $http.get('contents/real_time_positions')) as Promise<{
        data: RealTimePosition[]
        lastUpdate: string
      }>
    } catch (e) {
      return Promise.reject(e)
    }
  },
  publicTreasuries: () => $http.get('contents/public_treasuries'),
  news: {
    upbit: () => $http.get('contents/news/upbit') as Promise<{
      success: boolean
      data: {
        featured_list: UpbitNews[]
        list: UpbitNews[]
      }
    }>,
  },
}

export default content