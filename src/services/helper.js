import { $http } from '@/modules/axios'

const helper = {
  crawlMetaTags: url => $http.get('helpers/crawl_meta_tags', { params: { url } }),
}

export default helper