import { RouteLocation } from 'vue-router'
import { onMounted, onServerPrefetch, watch } from 'vue'
import helpers from '@/helpers'
import useChatHandler from '../chat-handler'
import useGlobalHooks from '../global-hooks'

const useRouteWatcher = () => {
  const { router } = useGlobalHooks()

  const { ping } = useChatHandler()

  const appendMetaTags = (currentRoute: RouteLocation) => {
    helpers.meta.setDocumentTitle(currentRoute.meta.title as string)
    helpers.meta.renderDescription(currentRoute.meta.description as string)
    helpers.meta.renderOgImage(currentRoute.meta.image as string)
    helpers.meta.renderCanonicalLink({ currentRoute })
  }

  watch(
    () => router.currentRoute.value,
    newVal => {
      appendMetaTags(newVal)
      ping()
    },
  )

  onMounted(() => {
    appendMetaTags(router.currentRoute.value)
  })

  onServerPrefetch(() => {
    appendMetaTags(router.currentRoute.value)
  })
}

export default useRouteWatcher