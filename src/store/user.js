import helpers from '@/helpers'
import axios, { $http } from '@/modules/axios'
import userService from '@/services/user'
import { router } from '@/router'

const afterSignIn = async ({ dispatch, getters, token, customRouteTo }) => {
  window.localStorage.setItem('header', JSON.stringify({ token }))

  try {
    await dispatch('loadAuthToken')
    await dispatch('loadAuthRequired')
    const prevFullPath = helpers.localStorage.getMeta('prevFullPath')
    router.push(customRouteTo || prevFullPath || '/')
    dispatch('setAccount', {
      nickname: getters.me.profile.nickname,
      image: getters.me.profile.image,
    }).catch(e => helpers.toast.error(e.data.message))
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
    async setAccount({ commit, getters }, profile) {
      try {
        const user = await $http.put(`webchat/users/${getters.chatUser.token}`, {
          profile,
        })
        commit('setChatUser', user)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async loadMe({ commit, dispatch }) {
      try {
        const user = await userService.me()
        commit('setMe', user)
      } catch (e) {
        dispatch('signOut')
      }
    },
    async signIn({ dispatch, getters }, { email, password, customRouteTo }) {
      try {
        const data = await userService.signIn({ email, password })
        await afterSignIn({ dispatch, getters, token: data.token, customRouteTo })
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async signInKakao({ dispatch, getters }, { kakaoId, email }) {
      try {
        const { token } = await userService.signInKakao({ kakaoId, email })
        await afterSignIn({ dispatch, getters, token })
      } catch (e) {
        return Promise.reject(e)
      }
    },
    signOut() {
      const removeTheseKeys = ['header', 'meta']
      removeTheseKeys.forEach(key => window.localStorage.removeItem(key))
      location.reload()
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