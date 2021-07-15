import helpers from '@/helpers'

const useLazyLoads = () => {
  if (process.env.NODE_ENV !== 'production') return

  helpers.dom.loadScript({ url: 'https://apis.google.com/js/platform.js' })
}

export default useLazyLoads