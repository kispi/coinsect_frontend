import { getCurrentInstance, onMounted } from 'vue'

const useKakao = () => {
  const plugins = getCurrentInstance().appContext.config.globalProperties

  const init = async () => {
    await plugins.$helpers.dom.loadScript({ url: 'https://developers.kakao.com/sdk/js/kakao.js' })
    if (typeof Kakao === 'undefined') return

    if (!Kakao.isInitialized()) Kakao.init(process.env.VUE_APP_OAUTH_KAKAO)
  }

  const signIn = () => {
    console.log(process.env.VUE_APP_OAUTH_KAKAO)
    Kakao.Auth.login({
      success: resp => {
        console.log('resp1', resp)
        Kakao.API.request(({
          url: '/v2/user/me',
          success: resp => {
            console.log(resp)
          },
          fail: err => {
            console.log(err)
          }
        }))
      },
      fail: err => {
        console.log(err)
      },
    })
  }

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