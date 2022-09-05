import helperService from '@/services/helper'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const useSeo = () => {
  const router = useRouter()

  const numTrial = ref(0)

  const meta = ref({
    image: null,
    title: null,
    description: null,
  })

  const reset = () => {
    meta.value.image = null
    meta.value.title = null
    meta.value.description = null
  }

  const onClickMetaCard = link => {
    if (!link) return

    if (link.startsWith('https://coinsect.io')) {
      const path = link.split('https://coinsect.io')[1]
      router.push(path)
      return
    }

    const openable = link.startsWith('http') ? link : `https://${link}`
    window.open(openable, '_blank', 'noreferrer noopener')
  }

  const useExamples = helperService.crawlExampleUrls

  const tryMetaTags = async link => {
    if (!link || numTrial.value >= 3) {
      numTrial.value = 0
      return Promise.reject()
    }

    if (['.jpg', '.jpeg', '.png', '.svg', '.gif'].some(ext => link.endsWith(ext))) {
      meta.value.image = link
      return
    }

    try {
      const data = await helperService.crawlMetaTags(link)
      if (data.status === 'crawling') {
        numTrial.value++
        setTimeout(() => tryMetaTags(link), 2000)
        return
      }
      meta.value = data.meta
    } catch (e) {
      return Promise.reject(e)
    }
  }

  return {
    meta,
    reset,
    useExamples,
    tryMetaTags,
    onClickMetaCard,
  }
}

export default useSeo