<template>
  <AppHeader/>
  <div
    class="app-body view-layout-default"
    :class="['no-scrollbar']">
    <RouterView v-if="$store.getters.isSSR || prepared" class="router-view-container"/>
    <AdSense :dataAdSlot="'9230500527'" v-if="!$store.getters.isSSR" class="display-block"/>
  </div>
  <AppFooter/>
  <AppAddons v-if="!$store.getters.isSSR"/>
</template>

<script>
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'
import helpers from './helpers'

export default {
  components: {
    AppHeader: defineAsyncComponent(() => import('@/components/app/app-header/AppHeader')),
    AppAddons: defineAsyncComponent(() => import('@/components/app/addons/AppAddons')),
    AppFooter: defineAsyncComponent(() => import('@/components/app/AppFooter')),
  },
  setup() {
    const store = useStore()

    const prepared = ref(null)

    const setIsMobile = () => store.commit('setIsMobile')

    const onScroll = e => {
      if (!e.target.classList || !e.target.classList.contains('app-body')) return

      store.commit('setScrollTop', e.target.scrollTop)
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

    onMounted(() => {
      prepare()
      store.commit('setSettings', helpers.localStorage.getMeta('settings') || store.getters.settings)
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
  background: var(--background-base);
}

.app-header {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1;
  background: var(--background-base);
}

.app-body {
  overflow-x: hidden;
  flex: 1;

  &.view-layout-default {
    padding-top: calc(var(--app-header-height) + var(--app-default-page-padding));
  }

  .ad-sense {
    margin: 40px auto;
    max-width: 992px;
    height: 280px;
  }
}
</style>