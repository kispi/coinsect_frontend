import { useStore } from 'vuex'

const usePWA = () => {
  const store = useStore()

  const A2HS = store.getters.isSSR ? {} : (window.__A2HS__ || {})

  const initFirebase = async () => {
    if (store.getters.isSSR) return

    const firebase = window.__coinsect__firebase__
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