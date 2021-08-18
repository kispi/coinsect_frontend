import { watch } from 'vue'
import { useRouter } from 'vue-router'
import helpers from '@/helpers'

const useRouteWatcher = () => {
  const router = useRouter()

  const defaultTitle = '코인충 - 대한민국 No.1 암호자산 커뮤니티'

  watch(
    () => router.currentRoute.value,
    newVal => {
      helpers.meta.setDocumentTitle(newVal.meta.title || defaultTitle)
      helpers.meta.renderDescription(newVal.meta.description)
      helpers.meta.renderOgImage(newVal.meta.image)
      helpers.meta.renderCanonicalLink({ currentRoute: newVal })
    },
  )
}

export default useRouteWatcher