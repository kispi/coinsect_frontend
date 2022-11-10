import { router } from '@/router'

export const postHelpers = {
  params: {
    asObject: () => {
      const q = router.currentRoute.value.query
      return {
        page: parseInt(q.page || 1),
        limit: parseInt(q.limit || 20),
        offset: parseInt(q.page - 1) * parseInt(q.limit),
        keyword: q.keyword,
        boardId: parseInt(q.boardId || 1),
      }
    },
    asQueryString: () => {
      const o = postHelpers.params.asObject()
      return Object.keys(o).filter(key => o[key]).map(key => `${key}=${o[key]}`).join('&')
    },
  },
}

export default postHelpers