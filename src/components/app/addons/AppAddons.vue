<template v-if="!$store.getters.isSSR">
  <AppLoading :loading="$store.getters.loading.global" class="global-loading"/>
  <AppDock/>
  <AppChat v-if="prepared"/>
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
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import AppChat from '@/components/applications/chat/AppChat'
import AppDock from '@/components/app/AppDock'
import AppModal from '@/components/app/AppModal'
import AppTooltips from '@/components/app/AppTooltips'
import AppToast from '@/components/app/AppToast'
import GoToTop from '@/components/app/GoToTop'
import useHealthChecker from '@/hooks/addons/health-checker'
import useRouteWatcher from '@/hooks/addons/route-watcher'

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

    const prepared = ref(true)

    const store = useStore()

    watch(
      () => store.getters.me,
      () => {
        prepared.value = false
        setTimeout(() => prepared.value = true)
      },
    )

    return {
      prepared,
    }
  },
}
</script>

<style lang="scss" scoped>
.global-loading {
  z-index: 10 !important;
  position: fixed;
}
</style>