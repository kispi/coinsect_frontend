<template v-if="!$store.getters.isSSR">
  <AppLoading :loading="$store.getters.loading.global" class="global-loading"/>
  <AppDock/>
  <AppChat/>
  <AppToast/>
  <AppTooltips/>
  <AppModal
    :modal="modal"
    :key="idx"
    v-for="(modal, idx) in $store.getters.modals"
  />
  <GoToTop/>
</template>

<script>
import AppChat from '@/components/applications/chat/AppChat'
import AppDock from '@/components/app/AppDock'
import AppModal from '@/components/app/AppModal'
import AppTooltips from '@/components/app/AppTooltips'
import AppToast from '@/components/app/AppToast'
import GoToTop from '@/components/app/GoToTop'
import useHealthChecker from '@/hooks/addons/health-checker'
import useRouteWatcher from '@/hooks/addons/route-watcher'
import usePWA from '@/hooks/addons/pwa'

export default {
  components: {
    AppChat,
    AppDock,
    AppModal,
    AppTooltips,
    AppToast,
    GoToTop,
  },
  setup() {
    useHealthChecker()

    useRouteWatcher()

    const { A2HS } = usePWA()

    A2HS.listen()
  },
}
</script>

<style lang="scss" scoped>
.global-loading {
  z-index: 10 !important;
  position: fixed;
}
</style>