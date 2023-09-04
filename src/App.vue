<template>
  <AppHeader class="layout-centered"/>
  <AppNavigation/>
  <div class="app-body layout-centered">
    <div class="router-view-container w-100">
      <AppAd class="m-b-16"/>
      <MultiCharts v-if="prepared" class="m-b-16"/>
      <FavoriteRoutes/>
      <RouterView
        v-if="$store.getters.isSSR || prepared"
        v-slot="{ Component, route }">
        <component :is="Component" :key="route.path"/>
      </RouterView>
    </div>
  </div>
  <AppFooter/>
  <AppAddons/>
</template>

<script>
import { ref, onMounted, onUnmounted, defineAsyncComponent, computed } from 'vue'
import helpers from '@/helpers'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  components: {
    AppHeader: defineAsyncComponent(() => import('@/components/app/app-header/AppHeader')),
    AppNavigation: defineAsyncComponent(() => import('@/components/app/AppNavigation')),
    AppAddons: defineAsyncComponent(() => import('@/components/app/addons/AppAddons')),
    AppFooter: defineAsyncComponent(() => import('@/components/app/AppFooter')),
    AppAd: defineAsyncComponent(() => import('@/components/app/AppAd')),
    FavoriteRoutes: defineAsyncComponent(() => import('@/components/common/FavoriteRoutes')),
  },
  setup() {
    const { store } = useGlobalHooks()

    const prepared = ref(null)

    const setIsMobile = () => store.commit('setIsMobile')

    const onScroll = () => {
      const scrollTop = document.scrollingElement.scrollTop
      if (!scrollTop) return

      store.commit('setScrollTop', scrollTop)
    }

    const favoriteRoutes = computed(() => {
      const base = [
        { title: 'NEWS', path: '/contents/news', emoji: '📰' },
        { title: 'ECONOMIC_CALENDAR', path: '/contents/economic-calendar', img: 'https://d1085v6s0hknp1.cloudfront.net/assets/icon-investing.jpg' },
        { title: 'CRYPTO', path: '/markets/crypto', emoji: '₿' },
        { title: 'NASDAQ', path: '/markets/nasdaq', img: 'https://yt3.googleusercontent.com/ytc/AGIKgqMZKdfkx5yIMjtGEuX6jPQA_NIqwwbpfq1MdhRDNw=s900-c-k-c0x00ffffff-no-rj' },
      ]
      if (!store.getters.isMobile) base.push({ title: 'KOSPI', path: '/markets/kospi', img: 'https://www.samsung.com/sec/static/etc/designs/smg/global/imgs/logo-square-letter.png' })

      return base
    })

    const prepare = async () => {
      try {
        await store.dispatch('bootstrap')
        prepared.value = true
      } finally {
        if (typeof document !== 'undefined') {
          const body = document.getElementsByTagName('body')[0]
          body.removeAttribute('style')
        }
      }
    }

    const onVisibilityChange = () => store.commit('setDocumentVisible', document.visibilityState === 'visible')

    onMounted(() => {
      prepare()
      store.commit('setSettings', helpers.localStorage.getMeta('settings') || store.getters.settings)
      store.commit('setCharts', helpers.localStorage.getMeta('charts') || store.getters.charts)
      window.addEventListener('resize', setIsMobile)
      window.addEventListener('scroll', onScroll, { capture: true })
      document.addEventListener('visibilitychange', onVisibilityChange)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', setIsMobile)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    })

    return {
      prepared,
      favoriteRoutes,
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
}

.app-body {
  min-height: calc(100vh - 560px); // 560 for footer
  padding:
    calc(var(--app-header-height) + var(--app-default-page-padding))
    var(--app-default-page-padding)
    80px;
}
</style>
