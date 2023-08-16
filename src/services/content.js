import { $http } from '@/modules/axios'

const content = {
  realTimePositions: () => $http.get('contents/real_time_positions'),
  bitcoinArticles: () => $http.get('contents/orange_pill'),
  publicTreasuries: () => $http.get('contents/public_treasuries'),
  news: {
    upbit: () => $http.get('contents/news/upbit'),
  },
}

export default content