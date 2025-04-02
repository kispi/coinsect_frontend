import { Board, Post } from '@/types'
import { router } from '@/router'
import helpers from '.'

export const postHelpers = {
  params: {
    asObject: () => {
      const q = router.currentRoute.value.query
      return {
        limit: parseInt(q.limit as string) || 20 ,
        offset: (parseInt(q.page as string) - 1) * parseInt(q.limit as string),
        keyword: q.keyword,
        boardId: parseInt(q.boardId as string),
      }
    },
    asQueryString: () => {
      const o = postHelpers.params.asObject()
      return Object.keys(o).filter(key => o[key as keyof typeof o]).map(key => `${key}=${o[key as keyof typeof o]}`).join('&')
    },
  },
  populateBoardsColors: async (boards: Board[]) => {
    await Promise.all(boards.map(async board => {
      const hash = await helpers.logic.crypto.hash.sha256(board.description) || ''
      board.$$color = `#${hash.substring(0, 6)}`
    }))
  },
  populateRenderablePost: async (post: Post) => {
    post.$$images = helpers.logic.retrieveImagesFromHTML(post.content)
    post.$$thumbnail = helpers.youtube.retrieveYouTubeThumbnailFromHTML(post.content)
    await postHelpers.populateBoardsColors([post.board])
  },
  populateRenderablePosts: async (posts: Post[]) => {
    const promises = posts.map(postHelpers.populateRenderablePost)
    await Promise.all(promises)
  },
}

export default postHelpers