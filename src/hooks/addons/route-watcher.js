import { onMounted, onServerPrefetch, watch } from 'vue'
import { useRouter } from 'vue-router'
import helpers from '@/helpers'
import useChatHandler from '../chat-handler'

const useRouteWatcher = () => {
  const router = useRouter()

  const { ping } = useChatHandler()

  const appendMetaTags = currentRoute => {
    helpers.meta.setDocumentTitle(currentRoute.meta.title)
    helpers.meta.renderDescription(currentRoute.meta.description)
    helpers.meta.renderOgImage(currentRoute.meta.image)
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