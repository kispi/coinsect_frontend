<template>
  <AppHeader :class="{'folded': $store.getters.settings.headerFolded}"/>
  <div
    class="app-body view-layout-default no-scrollbar"
    :class="{'folded': $store.getters.settings.headerFolded}">
    <AdSense v-if="showAd" v-show="$router.currentRoute.value.path === '/'" :dataAdSlot="'9230500527'" class="horizontal"/>
    <AppRowAds v-if="showAd" v-show="$store.getters.windowInnerWidth >= 992"/>
    <RouterView
      v-if="$store.getters.isSSR || prepared"
      v-slot="{ Component, route }"
      class="router-view-container">
      <component :is="Component" :key="route.path"/>
    </RouterView>
  </div>
  <AppFooter/>
  <AppAddons/>
</template>

<script>
import { ref, onMounted, onUnmounted, defineAsyncComponent, watch } from 'vue'
import helpers from './helpers'
import useGlobalHooks from './hooks/global-hooks'

export default {
  components: {
    AppHeader: defineAsyncComponent(() => import('@/components/app/app-header/AppHeader')),
    AppAddons: defineAsyncComponent(() => import('@/components/app/addons/AppAddons')),
    AppFooter: defineAsyncComponent(() => import('@/components/app/AppFooter')),
    AppRowAds: defineAsyncComponent(() => import('@/components/app/AppRowAds')),
  },
  setup() {
    const { plugins, store, router } = useGlobalHooks()

    const prepared = ref(null)

    const showAd = ref(null)

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
        setTimeout(() => showAd.value = true, 2000)
      } finally {
        if (typeof document !== 'undefined') {
          const body = document.getElementsByTagName('body')[0]
          body.removeAttribute('style')
        }
      }
    }

    onMounted(() => {
      prepare()
      store.commit('setSettings', helpers.localStorage.getMeta('settings') || store.getters.settings)
      store.commit('setCharts', helpers.localStorage.getMeta('charts') || store.getters.charts)
      window.addEventListener('resize', setIsMobile)
      window.addEventListener('scroll', onScroll, { capture: true })
    })

    onUnmounted(() => {
      window.removeEventListener('resize', setIsMobile)
      window.removeEventListener('scroll', onScroll)
    })

    // 같은 값에 대한 watcher가 아래도 있는데, showAd.value = false와 initAd에 대한 debounced 실행을 분리하기 위함.
    watch(
      () => router.currentRoute.value.path,
      () => showAd.value = false,
    )

    watch(
      () => router.currentRoute.value.path,
      plugins.$helpers.debounce(() => showAd.value = true, 2000),
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

.layout-centered {
  max-width: 992px;
  margin: auto;
  padding: var(--app-default-page-padding);
}

.view-layout-default {
  @extend .layout-centered;

  padding-top: calc(var(--app-header-height) + var(--app-default-page-padding) * 2);
  padding-bottom: 80px;
}

.app-header {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 5;
  background: var(--background-base);

  &.folded {
    .logo-and-settings {
      padding-top: 0;
      border-bottom: 1px solid var(--border-base);
    }

    .ah-menu-items,
    .top {
      display: none;
    }
  }
}

.app-body {
  overflow-x: hidden;
  min-height: 100vh;
  flex: 1;

  .ad-sense {
    &.horizontal {
      display: block;
      margin-bottom: 8px;
      max-width: 992px;
      height: 280px;
    }
  }

  &.folded {
    --app-header-height: 40px;
  }
}
</style>
