import { getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const useGlobalHooks = () => {
  const plugins = getCurrentInstance().appContext.config.globalProperties

  const store = useStore()

  const router = useRouter()

  return {
    plugins,
    store,
    router,
  }
}

export default useGlobalHooks