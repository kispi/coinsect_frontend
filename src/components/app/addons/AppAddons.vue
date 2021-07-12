<template>
  <div class="app-addons"></div>
  <AppToast/>
  <AppTooltips/>
  <AppModal
    :modal="modal"
    :key="idx"
    v-for="(modal, idx) in $store.getters.modals"
  />
</template>

<script>
import addons from '@/hooks/addons'
import AppModal from '@/components/app/AppModal'
import AppTooltips from '@/components/app/AppTooltips'
import AppToast from '@/components/app/AppToast'

export default {
  components: {
    AppModal,
    AppTooltips,
    AppToast,
  }
}
</script>