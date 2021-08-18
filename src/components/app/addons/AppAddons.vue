<template>
  <AppChat v-if="Object.keys($store.getters.symbols).length > 0"/>
  <AppToast/>
  <AppTooltips/>
  <AppModal
    :modal="modal"
    :key="idx"
    v-for="(modal, idx) in $store.getters.modals"
  />
</template>

<script>
import AppChat from '@/components/app/chat/AppChat'
import AppModal from '@/components/app/AppModal'
import AppTooltips from '@/components/app/AppTooltips'
import AppToast from '@/components/app/AppToast'
import useRouteWatcher from '@/hooks/addons/route-watcher'

export default {
  components: {
    AppChat,
    AppModal,
    AppTooltips,
    AppToast,
  },
  setup() {
    useRouteWatcher()
  },
}
</script>