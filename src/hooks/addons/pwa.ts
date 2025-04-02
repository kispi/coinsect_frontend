import { ref } from 'vue'
import useGlobalHooks from '../global-hooks'

type WindowWithPWAOptions = {
  __A2HS__: {
    prompt: () => Promise<void>
    deferredPrompt: any
  }
  __coinsect__firebase__: {
    init: () => Promise<{ token: string }>
    token: string
  }
}

declare const window: Window & WindowWithPWAOptions

const usePWA = () => {
  const { store } = useGlobalHooks()

  const A2HS = store.getters.isSSR ? {} : (window.__A2HS__ || {})

  const timesTried = ref(0)

  const initFirebase = async (): Promise<string> => {
    if (store.getters.isSSR) return ''

    const firebase = window.__coinsect__firebase__
    try {
      await firebase.init()
      return firebase.token
    } catch (e) {
      timesTried.value++
      if (timesTried.value > 1) return Promise.reject(e)
      else return initFirebase()
    } finally {
      timesTried.value = 0
    }
  }

  return {
    A2HS,
    initFirebase,
  }
}

export default usePWA