import { onMounted } from 'vue'
import useGlobalHooks from '../global-hooks'

// Declare Kakao as a global variable
declare const Kakao: any

type KakaoUser = {
  connected_at: string
  id: number
  kakao_account: {
    email: string
    email_needs_agreement: boolean
    has_email: boolean
    is_email_valid: boolean
    is_email_verified: boolean
  }
}

const useKakao = () => {
  const { helpers, store } = useGlobalHooks()

  const init = async () => {
    await helpers.dom.loadScript({ url: 'https://developers.kakao.com/sdk/js/kakao.js' })
    if (typeof Kakao === 'undefined') return

    if (!Kakao.isInitialized()) Kakao.init(process.env.VUE_APP_OAUTH_KAKAO)
  }

  const loadKakaoMe = () => new Promise((resolve, reject) => {
    Kakao.API.request(({
      url: '/v2/user/me',
      success: (resp: KakaoUser) => {
        resolve(resp)
      },
      fail: reject,
    }))
  })

  const signIn = () => new Promise<void>((resolve, reject) => {
    Kakao.Auth.login({
      success: async () => {
        try {
          const user = await loadKakaoMe() as KakaoUser
          await store.dispatch('signInKakao', {
            kakaoId: user.id,
            email: user.kakao_account.email,
          })
          resolve()
        } catch (e) {
          reject(e)
        }
      },
      fail: (err: Error) => {
        reject(err)
      },
    })
  })

  // 탈퇴시 이거 먼저 실행하고 서버에서도 탈퇴처리
  const signOut = () => {
    if (!Kakao.Auth.getAccessToken()) return

    Kakao.API.request({
      url: '/v1/user/unlink',
      success: () => {}, // resp => {}
      fail: () => {}, // err => {}
    })
  }

  onMounted(init)

  return {
    signIn,
    signOut,
  }
}

export default useKakao