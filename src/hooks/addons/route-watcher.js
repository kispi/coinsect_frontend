import { onServerPrefetch, watch } from 'vue'
import { useRouter } from 'vue-router'
import helpers from '@/helpers'

const useRouteWatcher = () => {
  const router = useRouter()

  const defaultTitle = '코인충 - 대한민국 No.1 암호자산 커뮤니티'

  const appendMetaTags = currentRoute => {
    helpers.meta.setDocumentTitle(currentRoute.meta.title || defaultTitle)
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