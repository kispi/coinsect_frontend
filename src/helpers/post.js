import { router } from '@/router'
import helpers from '.'

export const postHelpers = {
  params: {
    asObject: () => {
      const q = router.currentRoute.value.query
      return {
        limit: parseInt(q.limit || 20),
        offset: parseInt(q.page - 1) * parseInt(q.limit),
        keyword: q.keyword,
        boardId: parseInt(q.boardId),
      }
    },
    asQueryString: () => {
      const o = postHelpers.params.asObject()
      return Object.keys(o).filter(key => o[key]).map(key => `${key}=${o[key]}`).join('&')
    },
  },
  populateRenderablePost: async post => {
    post.$$images = helpers.retrieveImagesFromHTML(post.content)
    const hash = await helpers.crypto.hash.sha256(post.board.description) || ''
    if (!hash) return

    post.board.$$color = `#${hash.substring(0, 6)}`
  },
  populateRenderablePosts: async posts => {
    const promises = posts.map(postHelpers.populateRenderablePost)
    await Promise.all(promises)
  },
}

export default postHelpers