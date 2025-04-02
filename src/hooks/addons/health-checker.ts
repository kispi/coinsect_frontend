import { CoinsectConfig } from '@/store/app'
import { onMounted } from 'vue'
import useGlobalHooks from '../global-hooks'

const useHealthChecker = () => {
  const { helpers, store } = useGlobalHooks()

  const refreshConfig = () => {
    setTimeout(async () => {
      try {
        const previousVersion = ((store.getters.config || {}).version || {}).frontend
        const config = await helpers.http().get('config') as CoinsectConfig
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