<template>
  <div
    ref="refDockIcon"
    class="app-dock-icon"
    @mouseover="(!$store.getters.isMobile && tooltip) ? $tooltip.show({
      id: 'tooltipDockIcon',
      showAbove: refDockIcon,
      text: $translate(tooltip),
      dark: $store.getters.settings.theme === 'light',
    }) : null"
    @mouseleave="$tooltip.hide('tooltipDockIcon')">
    <div class="icon-container shadowed">
      <AppImg
        class="overlay"
        :class="{'show': idx === currentIdx}"
        :src="image"
        :key="image"
        v-for="(image, idx) in images"
      />
      <slot/>
    </div>
    <BadgeUnreads :numUnreads="numUnreads"/>
    <div class="dot" :class="{'o-0': !active}"/>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'

export default {
  props: {
    tooltip: String,
    images: Array,
    numUnreads: Number,
    active: Boolean,
  },
  setup(props) {
    const refDockIcon = ref(null)

    const currentIdx = ref(0)

    const interv = ref(null)

    onMounted(() => {
      if ((props.images || []).length <= 1) return

      interv.value = setInterval(() => {
        if (currentIdx.value >= (props.images || []).length - 1) {
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

<style lang="scss" scoped>
.app-dock-icon {
  position: relative;
  user-select: none;
  cursor: pointer;

  .icon-container {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--white);
    position: relative;
  }

  i {
    font-size: 24px;
    color: var(--white);
  }

  img {
    border-radius: 16px;
    transition: opacity 1s ease;

    &:not(.show) {
      opacity: 0;
    }
  }

  &:hover {
    animation: hover-icon infinite 0.25s;
  }

  &:not(:last-child) {
    margin-right: 16px;
  }

  .badge-unreads {
    position: absolute;
    top: -4px;
    right: -4px;
  }

  .dot {
    width: 4px;
    height: 4px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: table;
    margin: 8px auto 0;
  }
}
</style>