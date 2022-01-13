import $store from '@/store'

// DOM을 직접 건드리는 함수들을 이쪽으로 분리
const dom = {
  headerHeight: () => {
    if (process.env.VUE_APP_SSR) return 56

    return (document.getElementsByClassName('app-header')[0] || {}).clientHeight || 0
  },
  scrollToTop: () => {
    document.scrollingElement.scrollTop = 0
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
  copyToClipboard: str => {
    const el = document.createElement('textarea')
    el.value = str
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  },
  loadScript: ({ url, attributes }) => new Promise(resolve => {
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
}

export default dom