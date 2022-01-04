import { onServerPrefetch, watch } from 'vue'
import { useRouter } from 'vue-router'
import helpers from '@/helpers'

const useRouteWatcher = () => {
  const router = useRouter()

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
    },
  )

  onServerPrefetch(() => {
    appendMetaTags(router.currentRoute.value)
  })
}

export default useRouteWatcher