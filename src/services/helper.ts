import { $http } from '@/modules/axios'

const helper = {
  crawlMetaTags: (url: string) => $http.post('helpers/crawled_websites', { url }) as Promise<{
    crawledAt: string
    meta: { description: string, title: string, image: string }
    status: string
    url: string
  }>,
  crawlExampleUrls: () => $http.get('helpers/crawled_websites/examples'),
  proxy: (url: string) => $http.post('helpers/proxy', { url }),
}

export default helper