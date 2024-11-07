import { getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import helpers from '@/helpers'

const useGlobalHooks = () => {
  const plugins = getCurrentInstance().appContext.config.globalProperties

  const store = useStore()

  const router = useRouter()

  return {
    plugins,
    store,
    router,
    helpers,
  }
}

export default useGlobalHooks