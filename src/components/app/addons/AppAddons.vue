<template v-if="!$store.getters.isSSR">
  <AppLoading :loading="$store.getters.loading.global" class="global-loading"/>
  <AppChatToggler/>
  <AppChat v-if="prepared"/>
  <AppToast/>
  <AppSnackbar/>
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
import AppChat from '@/components/applications/chat/AppChat'
import AppChatToggler from '@/components/applications/chat/AppChatToggler'
import AppModal from '@/components/app/AppModal'
import AppSnackbar from '@/components/app/AppSnackbar'
import AppTooltips from '@/components/app/AppTooltips'
import AppToast from '@/components/app/AppToast'
import GoToTop from '@/components/app/GoToTop'
import useHealthChecker from '@/hooks/addons/health-checker'
import useRouteWatcher from '@/hooks/addons/route-watcher'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  components: {
    AppChat,
    AppChatToggler,
    AppModal,
    AppSnackbar,
    AppTooltips,
    AppToast,
    GoToTop,
  },
  setup() {
    useHealthChecker()

    useRouteWatcher()

    const prepared = ref(true)

    const { store } = useGlobalHooks()

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