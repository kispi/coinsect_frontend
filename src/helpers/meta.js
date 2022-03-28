import { store as $store } from '@/store'
import { router } from '@/router'
import useS3 from './s3'

const sanitize = html => {
  if (!html) return ''

  const regex = /(&nbsp;|<([^>]+)>)/ig
  return (html || '').replace(regex, '')
}

const defaults = {
  title: '김치 프리미엄, 김프, 역프 및 암호화폐 실시간 시세 - 코인충',
  description: '김프, 역프, 암호화폐, 비트코인 실시간 시세, 호가창, 뉴스, 비트멕스 리더보드(워뇨띠 포지션), 박호두 포지션 등을 제공하는 김프 사이트입니다.',
  image: useS3('og-images/og-image.png'),
}

const removeExisting = id => {
  if (process.env.VUE_APP_SSR) return

  const existingDom = document.getElementById(id)
  if (existingDom) document.head.removeChild(existingDom)
}

const appendMetaTags = tags => tags.forEach(tag => {
  $store.commit('appendMetaTags', tag)

  if (process.env.VUE_APP_SSR) return

  removeExisting(tag.id)
  const tagDOM = document.createElement(tag.tag || 'meta')
  Object.keys(tag).forEach(key => tagDOM.setAttribute(key, tag[key]))
  document.head.appendChild(tagDOM)
})

const meta = {
  setDocumentTitle: title => {
    const content = sanitize(title || defaults.title)
    if (!process.env.VUE_APP_SSR) document.title = content

    appendMetaTags([
      { id: 'meta-og-title', property: 'og:title', content },
      { id: 'meta-twitter-title', property: 'twitter:title', content },
    ], title)
  },
  renderDescription: description => {
    const content = sanitize(description || defaults.description)
    appendMetaTags([
      { id: 'meta-description', name: 'description', content },
      { id: 'meta-og-description', property: 'og:description', content },
      { id: 'meta-twitter-description', property: 'twitter:description', content },
    ])
  },
  renderOgImage: image => {
    const content = image || defaults.image
    if (!content.startsWith('http')) return

    appendMetaTags([
      { id: 'meta-og-image', property: 'og:image', content },
      { id: 'meta-twitter-image', property: 'twitter:image', content },
    ])
  },
  renderOgType: content => {
    appendMetaTags([
      { id: 'meta-og-type', property: 'og:type', content },
    ])
  },
  renderCanonicalLink: args => {
    const content = `https://coinsect.io${(args || {}).realCanonicalUrl || router.currentRoute.value.path}`
    appendMetaTags([
      { id: 'meta-og-url', property: 'og:url', content },
      { id: 'meta-twitter-url', property: 'twitter:url', content },
      { id: 'link-rel-canonical', rel: 'canonical', href: content, tag: 'link' },
    ])
  },
}

export default meta