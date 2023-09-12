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
  populateBoardsColors: async boards => {
    await Promise.all(boards.map(async board => {
      const hash = await helpers.logic.crypto.hash.sha256(board.description) || ''
      board.$$color = `#${hash.substring(0, 6)}`
    }))
  },
  populateRenderablePost: async post => {
    post.$$images = helpers.logic.retrieveImagesFromHTML(post.content)
    post.$$thumbnail = helpers.youtube.retrieveYouTubeThumbnailFromHTML(post.content)
    await postHelpers.populateBoardsColors([post.board])
  },
  populateRenderablePosts: async posts => {
    const promises = posts.map(postHelpers.populateRenderablePost)
    await Promise.all(promises)
  },
}

export default postHelpers