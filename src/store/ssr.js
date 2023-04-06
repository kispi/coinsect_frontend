import withCdn from '@/helpers/s3'

const defaults = {
  title: '김치 프리미엄, 김프, 역프 및 암호화폐 실시간 시세 - 코인충',
  description: '김프, 역프, 암호화폐, 비트코인 실시간 시세, 호가창, 뉴스, 비트멕스 리더보드(워뇨띠 포지션), 박호두 포지션 등을 제공하는 김프 사이트입니다.',
  image: withCdn('og-images/og-image.png'),
}

const ssr = {
  state: () => ({
    axiosHeader: null,
    frontendError: null,
    // 기본값으로 SSR되는 메타태그들이며, 다른 뷰에서 helpers.meta.setDocumentTitle 등의 함수가 onServerPrefetch 안에서 실행되면 그 값이 SSR된다.
    metaTags: {
      'meta-og-title': { id: 'meta-og-title', property: 'og:title', content: defaults.title },
      'meta-description': { id: 'meta-description', name: 'description', content: defaults.description },
      'meta-og-image': { id: 'meta-og-image', property: 'og:image', content: defaults.image },
    },
  }),
  getters: {
    isSSR: () => process.env.VUE_APP_SSR,
    axiosHeader: state => state.axiosHeader,
    frontendError: state => state.frontendError,
    metaTags: state => state.metaTags,
  },
  mutations: {
    setAxiosHeader(state, axiosHeader) {
      state.axiosHeader = axiosHeader
    },
    setFrontendError(state, frontendError) {
      state.frontendError = frontendError
    },
    appendMetaTags(state, tag) {
      state.metaTags[tag.id] = tag
    },
  },
}

export default ssr