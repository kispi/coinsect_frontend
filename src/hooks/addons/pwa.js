import { useStore } from 'vuex'

const usePWA = () => {
  const store = useStore()

  const A2HS = window.__A2HS__ || {}

  const firebase = window.__coinsect__firebase__

  const initFirebase = async () => {
    if (store.getters.isSSR) return

    try {
      await firebase.init()
      return firebase.token
    } catch (e) {
      return Promise.reject(e)
    }
  }

  return {
    A2HS,
    initFirebase,
  }
}

export default usePWA