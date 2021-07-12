<template>
  <AppHeader/>
  <div
    class="app-body"
    :class="{'no-scrollbar': $router.currentRoute.value.path === '/'}">
    <div class="router-view-container">
      <RouterView/>
    </div>
  </div>
  <AppAddons/>
</template>

<script>
import { onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import AppHeader from './components/app/app-header/AppHeader'
import AppAddons from '@/components/app/addons/AppAddons'

export default {
  components: {
    AppHeader,
    AppAddons,
  },
  setup() {
    const store = useStore()

    const setIsMobile = () => store.commit('setIsMobile')

    const onScroll = e => {
      if (!e.target.classList || !e.target.classList.contains('app-body')) return

      store.commit('setScrollTop', e.target.scrollTop)
    }

    onMounted(() => {
      store.dispatch('loadConfig')
      window.addEventListener('resize', setIsMobile)
      window.addEventListener('scroll', onScroll, { capture: true })
    })

    onUnmounted(() => {
      window.removeEventListener('resize', setIsMobile)
      window.removeEventListener('scroll', onScroll)
    })
  },
}
</script>

<style lang="scss">
#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-body {
  overflow-x: hidden;
  min-height: calc(100vh - var(--app-header-height));
  display: flex;
  flex-direction: column;

  .router-view-container {
    flex: 1 1 auto;
  }
}
</style>