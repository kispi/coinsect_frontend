<template>
  <AppHeader/>
  <div
    class="app-body view-layout-default"
    :class="['no-scrollbar']">
    <AppRowAds v-if="showAd" v-show="$store.getters.windowInnerWidth >= 992"/>
    <RouterView v-if="$store.getters.isSSR || prepared" class="router-view-container"/>
    <AdSense v-if="showAd" :dataAdSlot="'9230500527'" class="bottom"/>
  </div>
  <AppFooter/>
  <AppAddons/>
</template>

<script>
import { ref, onMounted, onUnmounted, defineAsyncComponent, watch, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import helpers from './helpers'

export default {
  components: {
    AppHeader: defineAsyncComponent(() => import('@/components/app/app-header/AppHeader')),
    AppAddons: defineAsyncComponent(() => import('@/components/app/addons/AppAddons')),
    AppFooter: defineAsyncComponent(() => import('@/components/app/AppFooter')),
    AppRowAds: defineAsyncComponent(() => import('@/components/app/AppRowAds')),
  },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const router = useRouter()

    const prepared = ref(null)

    const showAd = ref(null)

    const setIsMobile = () => store.commit('setIsMobile')

    const onScroll = () => {
      const scrollTop = document.scrollingElement.scrollTop
      if (!scrollTop) return

      store.commit('setScrollTop', scrollTop)
    }

    const initAd = () => {
      showAd.value = false
      if (['/updates', '/portfolio'].includes(router.currentRoute.value.path)) return

      setTimeout(() => showAd.value = true, 1000)
    }

    const prepare = async () => {
      try {
        await store.dispatch('bootstrap')
        prepared.value = true
        initAd()
      } finally {
        if (typeof document !== 'undefined') {
          const body = document.getElementsByTagName('body')[0]
          body.removeAttribute('style')
        }
      }
    }

    const storedSettings = () => {
      const o = helpers.localStorage.getMeta('settings') || store.getters.settings
      if (!['upbit', 'bithumb'].includes(o.baseExchange)) {
        o.baseExchange = 'upbit'
      }

      if (!['binance'].includes(o.targetExchange)) {
        o.targetExchange = 'binance'
      }

      return o
    }

    onMounted(() => {
      prepare()
      store.commit('setSettings', storedSettings())
      window.addEventListener('resize', setIsMobile)
      window.addEventListener('scroll', onScroll, { capture: true })
    })

    onUnmounted(() => {
      window.removeEventListener('resize', setIsMobile)
      window.removeEventListener('scroll', onScroll)
    })

    watch(
      () => router.currentRoute.value.path,
      initAd,
    )

    watch(
      () => store.getters.windowInnerWidth,
      plugins.$helpers.debounce(initAd, 5000),
    )

    return {
      showAd,
      prepared,
    }
  },
}
</script>

<style lang="scss">
#app {
  background: var(--background-base);
}

.app-header {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 5;
  background: var(--background-base);
}

.app-body {
  overflow-x: hidden;
  min-height: 100vh;
  flex: 1;

  &.view-layout-default {
    padding-top: calc(var(--app-header-height) + var(--app-default-page-padding));
  }

  .ad-sense {
    margin: 40px auto;
    max-width: 992px;
    height: 280px;

    &.bottom {
      display: block;
    }
  }
}
</style>