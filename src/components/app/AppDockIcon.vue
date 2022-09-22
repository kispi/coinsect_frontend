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
    <AppImg
      class="overlay"
      :class="{'show': idx === currentIdx}"
      :src="image"
      :key="image"
      v-for="(image, idx) in images"
    />
    <slot/>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'

export default {
  props: {
    tooltip: String,
    images: Array,
  },
  setup(props) {
    const refDockIcon = ref(null)

    const currentIdx = ref(0)

    const interv = ref(null)

    onMounted(() => {
      if ((props.images || []).length <= 1) return

      interv.value = setInterval(() => {
        if (currentIdx.value >= props.images.length - 1) {
          currentIdx.value = 0
          return
        }

        currentIdx.value += 1
      }, 5000)
    })

    onUnmounted(() => {
      clearInterval(interv.value)
    })

    return {
      refDockIcon,
      currentIdx,
    }
  },
}
</script>