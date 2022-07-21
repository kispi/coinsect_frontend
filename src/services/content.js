import { $http } from '@/modules/axios'

const content = {
  realTimePositions: () => $http.get('contents/real_time_positions'),
  publicTreasuries: () => $http.get('contents/public_treasuries'),
  news: {
    feeds: params => $http.get('contents/news/cobak/feeds', { params }),
    articles: params => $http.get('contents/news/cobak/articles', { params }),
    issues: params => $http.get('contents/news/cobak/issues', { params }),
  },
}

export default content