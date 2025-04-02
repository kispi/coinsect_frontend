import { RootState } from '@/store'
import { useRouter } from 'vue-router'
import { Store, useStore } from 'vuex'
import helpers from '@/helpers'

const useGlobalHooks = () => {
  const store = useStore() as Store<RootState>

  const router = useRouter()

  return {
    store,
    router,
    helpers,
  }
}

export default useGlobalHooks