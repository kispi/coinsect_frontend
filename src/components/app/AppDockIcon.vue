<template>
  <div
    ref="refDockIcon"
    class="app-dock-icon"
    @mouseover="tooltip ? $tooltip.show({
      id: 'tooltipDockIcon',
      showAbove: refDockIcon,
      text: $translate(tooltip),
      dark: $store.getters.settings.theme === 'light',
    }) : null"
    @mouseleave="$tooltip.hide('tooltipDockIcon')">
    <slot/>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: {
    tooltip: String,
  },
  setup() {
    const refDockIcon = ref(null)

    return {
      refDockIcon,
    }
  },
}
</script>
