import helpers from '@/helpers'
import communityService from '@/services/community'

const coinsectBoardIds = [1, 2] // 일단은 1, 2번 게시판만 노출

const post = {
  state: () => ({
    boards: null,
    post: null,
    posts: {
      page: 1,
      limit: 20,
      boardId: null,
      keyword: null,
      total: null,
      data: [],
    },
    notices: null,
  }),
  getters: {
    boards: state => state.boards,
    post: state => state.post,
    posts: state => state.posts,
    notices: state => state.notices,
  },
  mutations: {
    setBoards(state, boards) {
      state.boards = boards
    },
    setPost(state, post) {
      state.post = post
    },
    setPosts(state, posts) {
      Object.keys(posts).forEach(key => state.posts[key] = posts[key])
    },
    setNotices(state, notices) {
      state.notices = notices
    },
  },
  actions: {
    async loadBoards({ commit }) {
      try {
        const resp = await communityService.board.all()
        commit('setBoards', (resp.data || []).filter(b => coinsectBoardIds.includes(b.id)))
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async loadPost({ commit }, sharingKey) {
      try {
        commit('setLoading', { post: true })
        const data = await communityService.post.detail(sharingKey)
        data.renderable = {
          reactions: data.$$reactions,
          numReplies: data.$$numReplies,
        }
        commit('setPost', data)
      } catch (e) {
        return Promise.reject(e)
      } finally {
        commit('setLoading', { post: false })
      }
    },
    async loadPosts({ commit }, incomingParams) {
      const params = incomingParams || helpers.post.params.asObject()

      const o = helpers.qb().base()
      if (params.limit) o.limit(params.limit)
      if (params.offset) o.offset(params.offset)
      if (params.keyword) o.query(`keyword=${params.keyword}`)
      let whereStmt = 'post_type = "normal"'
      if (parseInt(params.boardId)) whereStmt += ` AND board_id = ${params.boardId}`
      else whereStmt += ` AND board_id IN (${coinsectBoardIds.join(',')})`
      o.where(whereStmt)

      try {
        commit('setLoading', { posts: true })
        const resp = await communityService.post.all(o.build())
        await helpers.post.populateRenderablePosts(resp.data)
        commit('setPosts', {
          ...resp,
          ...params,
        })
      } catch (e) {
        return Promise.reject(e)
      } finally {
        commit('setLoading', { posts: false })
      }
    },
    async loadNotices({ commit }) {
      const o = helpers.qb().base()
      o.where('post_type = "notice"')

      try {
        const data = await communityService.post.all(o.build())
        commit('setNotices', data)
      } catch (e) {
        return Promise.reject(e)
      }
    },
  },
}

export default post
