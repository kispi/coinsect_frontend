import { createStore, Store } from 'vuex'
import app, { VuexStateApp } from './app'
import chat, { VuexStateChat } from './chat'
import constant, { VuexStateConstant } from './constant'
import content, { VuexStateContent } from './content'
import dashboard, { VuexStateDashboard } from './dashboard'
import marketInfo, { VuexStateMarketInfo } from './market-info'
import post, { VuexStatePost } from './post'
import ssr, { VuexStateSSR } from './ssr'
import user, { VuexStateUser } from './user'

export interface RootState {
  app: VuexStateApp
  chat: VuexStateChat
  constant: VuexStateConstant
  content: VuexStateContent
  dashboard: VuexStateDashboard
  marketInfo: VuexStateMarketInfo
  post: VuexStatePost
  ssr: VuexStateSSR
  user: VuexStateUser
}

const initialState = {
  app: app.state,
  chat: chat.state,
  constant: constant.state,
  content: content.state,
  dashboard: dashboard.state,
  marketInfo: marketInfo.state,
  post: post.state,
  ssr: ssr.state,
  user: user.state,
}

export const newStore = () => createStore({
  devtools: false,
  modules: {
    app,
    chat,
    constant,
    content,
    dashboard,
    marketInfo,
    post,
    ssr,
    user,
  },
  mutations: {
    initAppData(state: RootState) {
      Object.keys(state).forEach(key => {
        const foo = initialState[key as keyof typeof initialState]
        if (!foo) {
          console.error(`'${key}'의 initialState가 정의되어 있지 않습니다. 이는 로그아웃시 앱이 올바로 초기화되지 않는 문제를 야기할 수 있습니다.`)
          return
        }

        // @ts-ignore
        Object.assign(state[key as keyof RootState], foo())
      })
    },
  },
  actions: {
    initSettings({ commit }) {
      if (initialState.app && typeof initialState.app == 'function') {
        commit('setSettings', initialState.app().settings)
        commit('setCharts', initialState.app().charts)
      }
    },
  },
})

export let store = {} as Store<RootState>

export const setStore = (o: Store<RootState>) => store = o

export default {
  store,
  setStore,
  newStore,
}