<template>
  <div
    ref="refAppTooltip"
    class="app-tooltip"
    :class="{
      'below': tooltip.below,
    }"
    :style="finalStyle">
    <div class="tooltip-body" v-html="$translate(tooltip.text)"/>
    <div class="triangle" :style="trianglePosition"/>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'

export default {
  props: {
    tooltip: null, // { bind, text, showAbove, below }
  },
  setup(props) {
    const refAppTooltip = ref(null)

    const finalStyle = ref({})

    const trianglePosition = ref({})

    const setFinalStyle = () => {
      const dom = props.tooltip.showAbove
      if (!dom) return

      const rectShowAbove = dom.getBoundingClientRect()
      const rectAppTooltip = refAppTooltip.value.getBoundingClientRect()

      if (props.tooltip.below) {
        finalStyle.value.top = `${-helpers.dom.headerHeight() + rectShowAbove.top + rectShowAbove.height + 8}px`
      } else {
        finalStyle.value.top = `${-helpers.dom.headerHeight() + rectShowAbove.top - rectAppTooltip.height - 16}px`
      }

      const distanceHor = window.innerWidth - rectShowAbove.left
      if (window.innerWidth < rectShowAbove.left + rectAppTooltip.width) {
        finalStyle.value.left = `${window.innerWidth - rectAppTooltip.width}px`
        trianglePosition.value = {
          left: 'initial',
          transform: 'initial',
          right: `${distanceHor - rectShowAbove.width / 2 - (props.tooltip.below ? 16 : 8)}px`,
        }
      } else {
        const left = rectShowAbove.left - rectAppTooltip.width / 2 + rectShowAbove.width / 2
        finalStyle.value.left = left < 0 ? 0 : `${left}px`
        if (left < 0) {
          trianglePosition.value = {
            left: `${rectShowAbove.left + rectShowAbove.width / 2}px`,
          }
        }
      }
    }

    onMounted(setFinalStyle)

    return {
      refAppTooltip,
      finalStyle,
      trianglePosition,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-tooltip {
  --bg-tooltip: rgba(255, 255, 255, 0.8);
  color: var(--black);
  background: var(--bg-tooltip);
  position: absolute;
  border-radius: 4px;
  padding: 8px 12px;
  max-width: 240px;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.24);

  --triangle-size: 8px;
  .triangle {
    width: 0;
    height: 0;
    border-left: var(--triangle-size) solid transparent;
    border-right: var(--triangle-size) solid transparent;
    border-top: var(--triangle-size) solid var(--bg-tooltip);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: calc(-1 * var(--triangle-size));
  }

  &.below {
    .triangle {
      top: calc(-1 * var(--triangle-size));
      bottom: 0;
      transform: rotate(180deg) translateX(50%) !important;
    }
  }
}
</style>