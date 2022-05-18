import { getCurrentInstance, onMounted } from 'vue'
import { useStore } from 'vuex'
import helpers from '@/helpers'

const useHealthChecker = () => {
  const plugins = getCurrentInstance().appContext.config.globalProperties

  const store = useStore()

  const refreshConfig = () => {
    setTimeout(async () => {
      try {
        const previousVersion = ((store.getters.config || {}).version || {}).frontend
        const config = await plugins.$http.get('config')
        if (previousVersion && config.version.frontend !== previousVersion) {
          helpers.toast.custom({
            html: 'TOAST_NEW_VERSION_AVAILABLE',
            duration: -1,
            action: {
              handler: () => window.location.reload(),
              label: 'REFRESH',
            },
          })
        }
        store.commit('setConfig', config)
        store.dispatch('loadNotifications')
      } catch (e) {}
      refreshConfig()
    }, 1000 * 60 * 5)
  }

  onMounted(refreshConfig)
}

export default useHealthChecker