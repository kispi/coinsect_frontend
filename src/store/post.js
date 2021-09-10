import helpers from '@/helpers'
import communityService from '@/services/community'

const post = {
  state: () => ({
    post: null,
    posts: null,
  }),
  getters: {
    post: state => state.post,
    posts: state => state.posts,
  },
  mutations: {
    setPost(state, post) {
      state.post = post
    },
    setPosts(state, posts) {
      state.posts = posts
    },
  },
  actions: {
    async loadPost({ commit }, id) {
      try {
        commit('setLoading', { post: true })
        const data = await communityService.post.detail(id)
        commit('setPost', data)
      } catch (e) {
        return Promise.reject(e)
      } finally {
        commit('setLoading', { post: false })
      }
    },
    async loadPosts({ commit }, params = {}) {
      // 나중엔 저 where문은 여기서 빠지고 백엔드로 가야되긴 함
      const o = helpers.qb().base()
      if (params.limit) o.limit(params.limit)
      if (params.offset) o.offset(params.offset)

      try {
        commit('setLoading', { posts: true })
        const data = await communityService.post.all(o.build())
        commit('setPosts', data)
      } catch (e) {
        return Promise.reject(e)
      } finally {
        commit('setLoading', { posts: false })
      }
    },
  },
}

export default post