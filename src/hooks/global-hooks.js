import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import helpers from '@/helpers'

const useGlobalHooks = () => {
  const store = useStore()

  const router = useRouter()

  return {
    store,
    router,
    helpers,
  }
}

export default useGlobalHooks