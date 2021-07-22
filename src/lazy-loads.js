import helpers from '@/helpers'

const useLazyLoads = () => {
  const loadGA = async () => {
    if (process.env.NODE_ENV !== 'production') return

    await helpers.dom.loadScript({ url: 'https://www.googletagmanager.com/gtag/js?id=G-595H41RVLD' })
    helpers.dom.loadScript({ url: '/gtm.js' })
  }

  loadGA()
}

export default useLazyLoads