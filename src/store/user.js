import helpers from '@/helpers'
import axios from '@/modules/axios'
import { router } from '@/router'
import userService from '@/services/user'

const afterSignIn = async ({ dispatch, token, customRouteTo }) => {
  window.localStorage.setItem('header', JSON.stringify({ token }))

  try {
    await dispatch('loadAuthToken')
    await dispatch('loadAuthRequired')
    const prevFullPath = helpers.localStorage.getMeta('prevFullPath')
    router.push(customRouteTo || prevFullPath || '/')
  } catch (e) {
    return Promise.reject(e)
  }
}

const user = {
  state: () => ({
    me: null,
    chatUser: null,
    chatUserSetting: null,
    header: null,
  }),
  getters: {
    me: state => state.me,
    chatUser: state => state.chatUser,
    chatUserSetting: state => state.chatUserSetting,
    header: state => state.header,
  },
  actions: {
    async loadAuthToken({ commit }) {
      const header = window.localStorage.getItem('header')
      if (!header) {
        window.localStorage.removeItem('header')
        return Promise.reject()
      }

      commit('setHeader', JSON.parse(header))
      axios.setRequestHeader(JSON.parse(header))
    },
    async loadMe({ commit, dispatch }) {
      try {
        const user = await userService.me()
        commit('setMe', user)
      } catch (e) {
        dispatch('signOut')
      }
    },
    async signIn({ dispatch }, { email, password, customRouteTo }) {
      try {
        const data = await userService.signIn({ email, password })
        await afterSignIn({ dispatch, token: data.token, customRouteTo })
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async signInKakao({ dispatch }, { kakaoId, email }) {
      try {
        const { token } = await userService.signInKakao({ kakaoId, email })
        await afterSignIn({ dispatch, token })
      } catch (e) {
        return Promise.reject(e)
      }
    },
    signOut({ commit, dispatch }) {
      const removeTheseKeys = ['header', 'meta']
      removeTheseKeys.forEach(key => window.localStorage.removeItem(key))
      axios.clearRequestHeader()
      // pushWithFrom 사용 X
      router.push('/').then(() => {
        commit('initAppData')
        dispatch('bootstrap')
      })
    },
  },
  mutations: {
    setMe(state, me) {
      state.me = me
    },
    setChatUser(state, chatUser) {
      state.chatUser = chatUser
    },
    setChatUserSetting(state, chatUserSetting) {
      state.chatUserSetting = chatUserSetting
    },
    setHeader(state, payload) {
      state.header = payload
    },
  },
}

export default user