<template>
  <AppHeader/>
  <div
    class="app-body"
    :class="['no-scrollbar']">
    <RouterView v-if="prepared" class="router-view-container"/>
    <AppLoading :loading="!prepared"/>
    <AppFooter/>
  </div>
  <AppAddons/>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import AppHeader from './components/app/app-header/AppHeader'
import AppAddons from '@/components/app/addons/AppAddons'
import AppFooter from '@/components/app/AppFooter'
import helpers from './helpers'

export default {
  components: {
    AppHeader,
    AppAddons,
    AppFooter,
  },
  setup() {
    const store = useStore()

    const prepared = ref(null)

    const setIsMobile = () => store.commit('setIsMobile')

    const onScroll = e => {
      if (!e.target.classList || !e.target.classList.contains('app-body')) return

      store.commit('setScrollTop', e.target.scrollTop)
    }

    onMounted(() => {
      store.commit('setSettings', helpers.localStorage.getMeta('settings') || store.getters.settings)
      store.dispatch('loadConfig').then(() => prepared.value = true)
      window.addEventListener('resize', setIsMobile)
      window.addEventListener('scroll', onScroll, { capture: true })
    })

    onUnmounted(() => {
      window.removeEventListener('resize', setIsMobile)
      window.removeEventListener('scroll', onScroll)
    })

    return {
      prepared,
    }
  },
}
</script>

<style lang="scss">
#app {
  width: 100vw;
  height: 100%;
  display: flex;
  flex-direction: column;

  &.dark {
    background: var(--background-base);
  }
}

.app-header {
  flex: 0;
}

.app-body {
  overflow-x: hidden;
  flex: 1;

  .router-view-container {
    min-height: calc(100vh - 160px);
  }
}
</style>