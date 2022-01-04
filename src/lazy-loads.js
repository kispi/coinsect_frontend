import helpers from '@/helpers'

const useLazyLoads = async () => {
  const loadGA = async () => {
    if (process.env.NODE_ENV !== 'production') return

    await helpers.dom.loadScript({ url: 'https://www.googletagmanager.com/gtag/js?id=G-595H41RVLD' })
    helpers.dom.loadScript({ url: '/gtm.js' })
  }

  const loadQuill = async () => {
    await helpers.dom.loadScript({ url: '//cdn.quilljs.com/1.3.7/quill.min.js'})
  }

  const loadVendors = async () => {
    await Promise.all([
      helpers.dom.loadScript({ url: 'https://cdn.jsdelivr.net/npm/hangul-js@0.2.6/hangul.min.js' }),
      helpers.dom.loadScript({ url: 'https://s3.tradingview.com/tv.js' }),
    ])
  }

  await Promise.all([
    loadQuill(),
    loadGA(),
    loadVendors(),
  ])
}

export default useLazyLoads