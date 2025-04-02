import { AccountStats, Profile, User } from '@/types'
import { Dispatch, Module } from 'vuex'
import { RootState } from '.'
import { router } from '@/router'
import helpers from '@/helpers'
import axios, { $http } from '@/modules/axios'
import userService from '@/services/user'

const afterSignIn = async ({
  dispatch,
  getters,
  token,
  customRouteTo,
}: {
  dispatch: Dispatch
  getters: any
  token: string
  customRouteTo?: string
}) => {
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

export interface VuexStateUser {
  me: User | null
  chatUser: User | null
  chatUserSetting: any | null
  header: Record<string, any> | null
  accountStats: AccountStats | null
}

const user: Module<VuexStateUser, RootState> = {
  state: () => ({
    me: null,
    chatUser: null,
    chatUserSetting: null,
    header: null,
    accountStats: null,
  }),
  getters: {
    me: state => state.me,
    chatUser: state => state.chatUser,
    chatUserSetting: state => state.chatUserSetting,
    header: state => state.header,
    accountStats: state => state.accountStats,
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
        }) as User
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
    async updateAuthProfile({ commit, getters }, profile: Profile) {
      try {
        const user = { ...getters.me, profile }
        const resp = await userService.update(user)
        commit('setMe', resp)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async loadAccountStats({ commit }) {
      try {
        const { stats } = await userService.accountStats()
        commit('setAccountStats', stats)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async signInKakao({ dispatch, getters }, { kakaoId, email }: { kakaoId: string, email: string }) {
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
    setAccountStats(state, stats) {
      state.accountStats = stats
    },
  },
}

export default user