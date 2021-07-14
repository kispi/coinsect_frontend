import { createStore } from 'vuex'
import app from './app'
import marketInfo from './market-info'
import translation from './translation'
import user from './user'

const initialState = {
  app: app.state,
  marketInfo: marketInfo.state,
  translation: translation.state,
  user: user.state,
}

const store = createStore({
  modules: {
    app,
    marketInfo,
    translation,
    user,
  },
  mutations: {
    initAppData(state) {
      Object.keys(state).forEach(key => {
        const foo = initialState[key]
        if (!foo) {
          console.error(`'${key}'의 initialState가 정의되어 있지 않습니다. 이는 로그아웃시 앱이 올바로 초기화되지 않는 문제를 야기할 수 있습니다.`)
          return
        }

        Object.assign(state[key], foo())
      })
    },
  },
})

export default store