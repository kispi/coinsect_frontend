import helpers from '@/helpers'
import communityService from '@/services/community'

const post = {
  state: () => ({
    post: null,
    posts: null,
    notices: null,
  }),
  getters: {
    post: state => state.post,
    posts: state => state.posts,
    notices: state => state.notices,
  },
  mutations: {
    setPost(state, post) {
      state.post = post
    },
    setPosts(state, posts) {
      state.posts = posts
    },
    setNotices(state, notices) {
      state.notices = notices
    },
  },
  actions: {
    async loadPost({ commit }, sharingKey) {
      try {
        commit('setLoading', { post: true })
        const data = await communityService.post.detail(sharingKey)
        commit('setPost', data)
      } catch (e) {
        return Promise.reject(e)
      } finally {
        commit('setLoading', { post: false })
      }
    },
    async loadPosts({ commit }, params = {}) {
      const o = helpers.qb().base()
      if (params.limit) o.limit(params.limit)
      if (params.offset) o.offset(params.offset)
      if (params.keyword) o.query(`keyword=${params.keyword}`)

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
    async loadNotices({ commit }) {
      if (helpers.canSkipApiCall('loadNotices', 60)) return

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