import { ref, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'

const usePWA = () => {
  const plugins = getCurrentInstance().appContext.config.globalProperties

  const store = useStore()

  const deferredPrompt = ref(null)

  const A2HS = {
    listen: () => {
      if (store.getters.isSSR) return

      window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault()
        deferredPrompt.value = e
      })
    },
    prompt: () => {
      if (!deferredPrompt.value) {
        plugins.$toast.error('beforeinstallprompt not fired')
        return
      }

      plugins.$toast.success('beforeinstallprompt should fire on mobile phone')
      deferredPrompt.value.prompt()
      deferredPrompt.value = null
    },
  }

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