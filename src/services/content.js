import { $http } from '@/modules/axios'

const content = {
  realTimePositions: () => $http.get('contents/real_time_positions'),
  publicTreasuries: () => $http.get('contents/public_treasuries'),
  news: {
    feeds: params => $http.get('contents/news/coinness/feeds', { params }),
    articles: params => $http.get('contents/news/coinness/articles', { params }),
    issues: params => $http.get('contents/news/coinness/issues', { params }),
  },
}

export default content