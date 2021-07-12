import helpers from '@/helpers'

const useLazyLoads = () => {
  if (process.env.NODE_ENV !== 'production') return

  helpers.dom.loadScript({ url: 'https://apis.google.com/js/platform.js' })
  helpers.dom.loadScript({ url: '/gtm.js' })
  helpers.dom.loadScript({ url: '/nreum.js' })
}

export default useLazyLoads