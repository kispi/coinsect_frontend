import { store as $store } from '@/store'

const regex = {
  url: /\b(?:https?|ftp):\/\/[a-z0-9-+&@#/%?=~_|!:,.;]*[a-z0-9-+&@#/%=~_|]/gim,
  pseudoUrl: /(^|[^/])(www\.[\S]+(\b|$))/gim,
  email: /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim,
}

// DOM을 직접 건드리는 함수들을 이쪽으로 분리
const dom = {
  regex,
  headerHeight: () => {
    if (process.env.VUE_APP_SSR) return 56

    return (document.getElementsByClassName('app-header')[0] || {}).clientHeight || 0
  },
  scrollToTop: () => {
    if (process.env.VUE_APP_SSR) return

    document.scrollingElement.scrollTop = 0
    $store.commit('setScrollTop', 0)
  },
  isElementInViewport: (el, percentVisible = 100) => {
    if (!el) return

    const rect = el.getBoundingClientRect()
    const windowHeight = (window.innerHeight || document.documentElement.clientHeight)

    return !(
      Math.floor(100 - (((rect.top >= 0 ? 0 : rect.top) / +-(rect.height / 1)) * 100)) < percentVisible ||
      Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) < percentVisible
    )
  },
  copyToClipboard: (str, link) => {
    if (process.env.VUE_APP_SSR) return

    const el = document.createElement('textarea')

    if (/Mac|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      el.value = str
      document.body.appendChild(el)
      el.select()
    }

    const listener = e => {
      e.clipboardData.setData('text/html', link ? `<a href="${link}">${str}</a>` : str)
      e.clipboardData.setData('text/plain', str)
      e.preventDefault()
    }

    document.addEventListener('copy', listener)
    document.execCommand('copy')
    document.removeEventListener('copy', listener)
    el.blur()
    el.remove()
  },
  loadScript: ({ url, attributes }) => new Promise(resolve => {
    if (process.env.VUE_APP_SSR) return

    if ($store.getters.lazyLoadedScriptUrls.includes(url)) {
      resolve()
      return
    }

    const scriptTag = document.createElement('script')
    if (attributes) attributes.forEach(attr => scriptTag.setAttribute(attr.key, attr.value))
    scriptTag.src = url
    scriptTag.async = true
    scriptTag.onload = resolve
    document.head.appendChild(scriptTag)
    $store.commit('addLazyLoadedScriptUrl', url)
  }),
  loadLink: ({ url, attributes }) => new Promise(resolve => {
    if ($store.getters.lazyLoadedScriptUrls.includes(url)) {
      resolve()
      return
    }

    const linkTag = document.createElement('link')
    if (attributes) attributes.forEach(attr => linkTag.setAttribute(attr.key, attr.value))
    linkTag.href = url
    linkTag.onload = resolve
    document.head.appendChild(linkTag)
    $store.commit('addLazyLoadedScriptUrl', url)
  }),
  linkify: text => text
    .replace(regex.url, `<a href="$&" class='text-underline c-brand-primary' rel='noreferrer' target="_blank">$&</a>`)
    .replace(regex.pseudoUrl, `$1<a href="http://$2" class='text-underline c-brand-primary' rel='noreferrer' target="_blank">$2</a>`)
    .replace(regex.email, `<a href="mailto:$&" class='text-underline c-brand-primary' rel='noreferrer' target="_blank">$&</a>`),
}

export default dom