<template>
  <div
    ref="refAppTooltip"
    class="app-tooltip"
    :style="finalStyle">
    <div v-html="$translate(text)"/>
    <div class="triangle" :style="trianglePosition"/>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'

export default {
  props: {
    bind: Boolean,
    text: String,
    showAbove: HTMLElement,
  },
  setup(props) {
    const refAppTooltip = ref(null)

    const finalStyle = ref({})

    const trianglePosition = ref({})

    const setFinalStyle = () => {
      const dom = props.showAbove
      if (!dom) return

      const rectShowAbove = dom.getBoundingClientRect()
      const rectAppTooltip = refAppTooltip.value.getBoundingClientRect()

      finalStyle.value.top = `${rectShowAbove.top - rectAppTooltip.height - 16}px`
      const distanceHor = window.innerWidth - rectShowAbove.left
      if (window.innerWidth < rectShowAbove.left + rectAppTooltip.width) {
        finalStyle.value.left = `${window.innerWidth - rectAppTooltip.width}px`
        trianglePosition.value = {
          left: 'initial',
          transform: 'initial',
          right: `${distanceHor - rectShowAbove.width / 2 - 8}px`,
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
$triangle-size: 8px;
.app-tooltip {
  color: var(--white);
  background: rgba(0, 0, 0, 0.8);
  position: absolute;
  border-radius: 4px;
  padding: 8px 12px;
  width: 240px;
  font-size: 12px;
  line-height: 18px;

  .triangle {
    width: 0;
    height: 0;
    border-left: $triangle-size solid transparent;
    border-right: $triangle-size solid transparent;
    border-top: $triangle-size solid rgba(0, 0, 0, 0.8);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -$triangle-size;
  }
}

#app.dark {
  .app-tooltip {
    background: var(--black-light);

    .triangle {
      border-top: $triangle-size solid var(--black-light);
    }
  }
}
</style>