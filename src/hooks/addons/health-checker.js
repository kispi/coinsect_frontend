import { onMounted } from 'vue'
import { useStore } from 'vuex'
import helpers from '@/helpers'

const useHealthChecker = () => {
  const store = useStore()

  const refreshConfig = () => {
    setTimeout(async () => {
      try {
        const config = await store.dispatch('loadConfig')
        if (config.version.frontend === store.getters.config.version.frontend) {
          helpers.toast.custom({
            html: 'TOAST_NEW_VERSION_AVAILABLE',
            duration: -1,
            action: {
              handler: () => window.location.reload(),
              label: 'REFRESH',
            },
          })
        }
      } catch (e) {}
      refreshConfig()
    }, 1000 * 60)
  }

  onMounted(refreshConfig)
}

export default useHealthChecker