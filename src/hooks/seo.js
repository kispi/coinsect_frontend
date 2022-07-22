import helperService from '@/services/helper'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const useSeo = () => {
  const router = useRouter()

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

    window.open(link, '_blank', 'noreferrer noopener')
  }

  const tryMetaTags = async link => {
    if (!link) return

    if (['.jpg', '.jpeg', '.png', '.svg', '.gif'].some(ext => link.endsWith(ext))) {
      meta.value.image = link
      return
    }

    try {
      const data = await helperService.crawlMetaTags(link)
      data.forEach(t => {
        if ((t.property || '').endsWith(':image')) meta.value.image = t.content
        if ((t.property || '').endsWith(':title')) meta.value.title = t.content
        if ((t.property || '').endsWith(':description')) meta.value.description = t.content
      })
    } catch (e) {
      return Promise.reject(e)
    }
  }

  return {
    meta,
    reset,
    tryMetaTags,
    onClickMetaCard,
  }
}

export default useSeo