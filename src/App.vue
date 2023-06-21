<template>
  <AppHeader class="layout-centered"/>
  <div class="app-body view-layout-default no-scrollbar">
    <AppNavigation/>
    <div class="router-view-container w-100">
      <AppAd class="m-b-16"/>
      <MultiCharts v-if="prepared" class="m-b-24"/>
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
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import helpers from './helpers'
import useGlobalHooks from './hooks/global-hooks'

export default {
  components: {
    AppHeader: defineAsyncComponent(() => import('@/components/app/app-header/AppHeader')),
    AppNavigation: defineAsyncComponent(() => import('@/components/app/AppNavigation')),
    AppAddons: defineAsyncComponent(() => import('@/components/app/addons/AppAddons')),
    AppFooter: defineAsyncComponent(() => import('@/components/app/AppFooter')),
    AppAd: defineAsyncComponent(() => import('@/components/app/AppAd')),
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
    }
  },
}
</script>

<style lang="scss">
#app {
  background: var(--background-base);
}

.layout-centered {
  max-width: 1200px;
  margin: auto;
  padding: var(--app-default-page-padding);
}

.view-layout-default {
  @extend .layout-centered;

  padding-top: calc(var(--app-header-height) + var(--app-default-page-padding));
  padding-bottom: 80px;
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
}
</style>
