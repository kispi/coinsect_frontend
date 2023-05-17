import { store } from '@/store'
import { router } from '@/router'

const sanitize = html => {
  if (!html) return ''

  const regex = /(&nbsp;|<([^>]+)>)/ig
  return (html || '').replace(regex, '')
}

const removeExisting = id => {
  if (process.env.VUE_APP_SSR) return

  const existingDom = document.getElementById(id)
  if (existingDom) document.head.removeChild(existingDom)
}

const appendMetaTags = tags => tags.forEach(tag => {
  store.commit('appendMetaTags', tag)

  if (process.env.VUE_APP_SSR) return

  removeExisting(tag.id)
  const tagDOM = document.createElement(tag.tag || 'meta')
  Object.keys(tag).forEach(key => tagDOM.setAttribute(key, tag[key]))
  document.head.appendChild(tagDOM)
})

const meta = {
  setDocumentTitle: title => {
    if (!title) return

    const content = sanitize(title)
    if (!process.env.VUE_APP_SSR) document.title = content

    appendMetaTags([
      { id: 'meta-og-title', property: 'og:title', content },
      { id: 'meta-twitter-title', property: 'twitter:title', content },
    ], title)
  },
  renderDescription: description => {
    if (!description) return

    const content = sanitize(description)
    appendMetaTags([
      { id: 'meta-description', name: 'description', content },
      { id: 'meta-og-description', property: 'og:description', content },
      { id: 'meta-twitter-description', property: 'twitter:description', content },
    ])
  },
  renderOgImage: image => {
    if (!image) return

    const content = image
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