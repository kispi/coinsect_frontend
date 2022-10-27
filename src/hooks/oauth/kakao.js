import { store } from '@/store'
import { getCurrentInstance, onMounted } from 'vue'

const useKakao = () => {
  const plugins = getCurrentInstance().appContext.config.globalProperties

  const init = async () => {
    await plugins.$helpers.dom.loadScript({ url: 'https://developers.kakao.com/sdk/js/kakao.js' })
    if (typeof Kakao === 'undefined') return

    if (!Kakao.isInitialized()) Kakao.init(process.env.VUE_APP_OAUTH_KAKAO)
  }

  const loadKakaoMe = () => new Promise((resolve, reject) => {
    Kakao.API.request(({
      url: '/v2/user/me',
      success: resp => {
        resolve(resp)
      },
      fail: reject,
    }))
  })

  const signIn = () => new Promise((resolve, reject) => {
    Kakao.Auth.login({
      success: async () => {
        try {
          const user = await loadKakaoMe()
          await store.dispatch('signInKakao', {
            kakaoId: user.id,
            email: user.kakao_account.email,
          })
          resolve()
        } catch (e) {
          reject(e)
        }
      },
      fail: err => {
        reject(err)
      },
    })
  })

  // 탈퇴시 이거 먼저 실행하고 서버에서도 탈퇴처리
  const signOut = () => {
    if (!Kakao.Auth.getAccessToken()) return

    Kakao.API.request({
      url: '/v1/user/unlink',
      success: resp => {
        console.log(resp)
      },
      fail: err => {
        console.log(err)
      },
    })
  }

  onMounted(init)

  return {
    signIn,
    signOut,
  }
}

export default useKakao