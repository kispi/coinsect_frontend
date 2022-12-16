<template>
  <div class="app-tooltips">
    <AppTooltip
      :tooltip="tooltip"
      :key="tooltip.key"
      v-for="tooltip in $store.getters.tooltips"
    />
  </div>
</template>

<script>
import { watch } from 'vue'
import AppTooltip from './AppTooltip'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  components: { AppTooltip },
  setup() {
    const { store, router } = useGlobalHooks()

    watch([
      () => router.currentRoute.value.path,
    ],
      () => store.commit('removeAllTooltips'),
    )
  },
}
</script>

<style lang="scss" scoped>
.app-tooltips {
  position: fixed;
  top: var(--app-header-height);
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 6;
  pointer-events: none;
}
</style>