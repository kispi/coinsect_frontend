<template>
  <AppHeader class="layout-centered"/>
  <AppNavigation/>
  <div class="app-body layout-centered">
    <div class="router-view-container w-100">
      <AppAd class="m-b-16"/>
      <MultiCharts v-if="prepared" class="m-b-16"/>
      <FavoriteRoutes/>
      <RouterView
        v-if="store.getters.isSSR || prepared"
        v-slot="{ Component, route }">
        <component :is="Component" :key="route.path"/>
      </RouterView>
    </div>
  </div>
  <AppFooter/>
  <AppAddons v-if="prepared"/>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineAsyncComponent, computed } from 'vue'
import helpers from '@/helpers'
import useGlobalHooks from '@/hooks/global-hooks'

const AppHeader = defineAsyncComponent(() => import('@/components/app/app-header/AppHeader'))
const AppNavigation = defineAsyncComponent(() => import('@/components/app/AppNavigation'))
const AppAddons = defineAsyncComponent(() => import('@/components/app/addons/AppAddons'))
const AppFooter = defineAsyncComponent(() => import('@/components/app/AppFooter'))
const AppAd = defineAsyncComponent(() => import('@/components/app/AppAd'))
const FavoriteRoutes = defineAsyncComponent(() => import('@/components/common/FavoriteRoutes'))

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
</script>

<style lang="scss">
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
