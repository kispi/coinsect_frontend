import helpers from '@/helpers'
import axios from '@/modules/axios'
import * as $http from 'axios'

const app = {
  state: () => ({
    toast: {
      html: null,
      type: null,
      show: false,
      duration: null,
      action: {
        handler: null,
        label: null,
      },
    },
    modals: [],
    tooltips: [],
    loading: {
      global: null,
    },
    isMobile: null,
    config: null,
    windowInnerWidth: null,
    windowInnerHeight: null,
    lastApiCall: {},
    scrollTops: {},  // scrollTop per page
    scrollTop: null, // global scrollTop value
    lazyLoadedScriptUrls: [],
  }),
  getters: {
    toast: state => state.toast,
    modals: state => state.modals,
    tooltips: state => state.tooltips,
    loading: state => state.loading,
    isMobile: state => state.isMobile,
    config: state => state.config,
    windowInnerWidth: state => state.windowInnerWidth,
    windowInnerHeight: state => state.windowInnerHeight,
    lastApiCall: state => state.lastApiCall,
    scrollTops: state => state.scrollTops,
    scrollTop: state => state.scrollTop,
    lazyLoadedScriptUrls: state => state.lazyLoadedScriptUrls,
  },
  mutations: {
    setToast(state, payload) {
      if (!payload) {
        state.toast = {
          html: null,
          type: null,
          show: false,
          duration: null,
          action: {
            handler: null,
            label: null,
          },
        }
        return
      }

      Object.keys(payload).forEach(key => state.toast[key] = payload[key])
    },
    setConfig(state, config) {
      state.config = config
    },
    setIsMobile(state) {
      state.windowInnerWidth = window.innerWidth
      state.windowInnerHeight = window.innerHeight
      state.isMobile = state.windowInnerWidth < 768
    },
    // payload: { routeName, scrollTop }
    setScrollTops(state, payload) {
      state.scrollTops[payload.routeName] = payload.scrollTop
    },
    setScrollTop(state, scrollTop) {
      state.scrollTop = scrollTop
    },
    setLoading(state, payload) {
      Object.keys(payload).forEach(key => state.loading[key] = payload[key])
    },
    addModal(state, modal) {
      state.modals.push(modal)
    },
    popModal(state) {
      state.modals.pop()
    },
    removeAllModals(state) {
      state.modals = []
    },
    addTooltip(state, tooltip) {
      state.tooltips.push(tooltip)
    },
    removeTooltip(state, id) {
      const tooltipIdx = state.tooltips.findIndex(t => t.id === id)
      if (tooltipIdx >= 0) state.tooltips.splice(tooltipIdx, 1)
    },
    removeAllTooltips(state) {
      state.tooltips = []
    },
    addLazyLoadedScriptUrl(state, url) {
      state.lazyLoadedScriptUrls.push(url)
    },
  },
  actions: {
    removeToast({ commit }) {
      commit('setToast', null)
    },
    // 앱 뜰 때 필요한 정보들 쭉 콜함
    async loadConfig({ commit, getters, dispatch }) {
      const loadAuthRequired = async () => {
        if (!getters.header) return

        try {
          await dispatch('loadMe')
        } catch (e) {}
      }

      commit('setIsMobile')
      commit('setScrollTop', 0)

      try {
        await dispatch('loadAuthToken')
      } catch (e) {}

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PUSH_TOKEN', token: (getters.header || {}).token || '' }))
      }

      // 모든 api의 호출 전에 실행
      $http.get('config').then(config => commit('setConfig', config))
      loadAuthNotRequired()
      await loadAuthRequired()
    },
  },
}

export default app