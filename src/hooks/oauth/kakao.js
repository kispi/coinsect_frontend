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

  const signIn = () => {
    Kakao.Auth.login({
      success: async () => {
        const user = await loadKakaoMe()
        store.dispatch('signInKakao', {
          kakaoId: user.id,
          email: user.kakao_account.email,
        })
      },
      fail: err => {
        plugins.$toast.error('카카오 로그인에 실패하였습니다')
        console.error(err)
      },
    })
  }

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