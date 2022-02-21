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
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import AppTooltip from './AppTooltip'

export default {
  components: { AppTooltip },
  setup() {
    const store = useStore()

    const router = useRouter()

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