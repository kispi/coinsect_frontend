import { $http } from '@/modules/axios'

const helper = {
  crawlMetaTags: url => $http.get(`helpers/crawled_websites/${encodeURIComponent(url)}`),
  crawlExampleUrls: () => $http.get('helpers/crawled_websites/examples'),
}

export default helper