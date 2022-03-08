import dom from './dom'
import toast from './toast'
import { store as $store } from '@/store'

const open = link => window.open(link, '_blank', 'width=600,height=600')

const getMetaContents = () => {
  const metaOgImage = document.getElementById('meta-og-image')
  const metaDescription = document.getElementById('meta-description')

  const o = {}
  if (metaOgImage) o.metaOgImage = metaOgImage.getAttribute('content')
  if (metaDescription) o.metaDescription = metaDescription.getAttribute('content')
  return o
}

export default {
  share: url => {
    const e = encodeURI

    return {
      facebook: () => {
        open(`https://www.facebook.com/sharer/sharer.php?u=${e(url)}`)
      },
      twitter: () => {
        open(`https://twitter.com/intent/tweet?url=${e(url)}`)
      },
      pinterest: () => {
        const o = getMetaContents()
        open(`https://pinterest.com/pin/create/link?url=${e(url)}&media=${e(o.metaOgImage)}&description=${e(o.metaDescription)}`)
      },
      whatsapp: () => {
        open(`https://${$store.getters.isMobile ? 'api' : 'web'}.whatsapp.com/send?text=${e(url)}`)
      },
      custom: () => {
        dom.copyToClipboard(e(url))
        toast.success('링크가 복사되었습니다! 문자나 카카오톡으로 붙여넣기해서 공유해보세요!')
      },
    }
  },
}