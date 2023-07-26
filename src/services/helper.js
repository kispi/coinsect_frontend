import { $http } from '@/modules/axios'

const helper = {
  crawlMetaTags: url => $http.post('helpers/crawled_websites', { url }),
  crawlExampleUrls: () => $http.get('helpers/crawled_websites/examples'),
  proxy: url => $http.post('helpers/proxy', { url }),
}

export default helper