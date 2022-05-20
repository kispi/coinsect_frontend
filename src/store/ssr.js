const ssr = {
  state: () => ({
    axiosHeader: null,
    frontendError: null,
    metaTags: {},
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