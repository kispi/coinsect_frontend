<template>
  <div class="app-slider">
    <div
      @touchstart.passive="onMousedown"
      @mousedown="onMousedown"
      ref="refContainer"
      class="app-slider-container">
      <div class="bar">
        <div class="fill" :style="{ width: `calc(${ratio * 100}%)`}"/>
      </div>
      <div class="handle" :style="handlePos"><div class="vr"/></div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  emits: ['change'],
  setup(_, { emit }) {
    const store = useStore()

    const refContainer = ref(null)

    const dragging = ref(null)

    const containerSize = ref(null)

    const handleSize = 40

    const handlePos = ref({
      width: `${handleSize}px`,
      left: 0,
    })

    const nextX = ref(0)

    const ratio = ref(0)

    const emitRatio = () => emit('change', ratio.value) // emits (0 <= ratio <= 1)

    const setNext = e => {
      if (!refContainer.value) return

      const rectX = refContainer.value.getBoundingClientRect().x
      nextX.value = (e.touches ? e.touches[0].clientX : e.clientX) - handleSize / 2 - rectX

      if (nextX.value < 0) nextX.value = 0
      if (nextX.value > containerSize.value - handleSize) nextX.value = containerSize.value - handleSize
    }

    const onMousemove = e => {
      if (!dragging.value) return

      setNext(e)

      handlePos.value.transform = `translateX(${nextX.value}px)`
      ratio.value = nextX.value / (containerSize.value - handleSize)
      emitRatio()
    }

    const onMousedown = e => {
      dragging.value = true
      document.addEventListener('mousemove', onMousemove)
      document.addEventListener('touchmove', onMousemove)

      // 헤더 안에서 클릭된 마우스의 위치만큼(offset)을 onMousemove에서 빼주어야함.
      setNext(e)
      handlePos.value.transform = `translateX(${nextX.value}px)`
      ratio.value = nextX.value / (containerSize.value - handleSize)
      emitRatio()
    }

    const onMouseup = () => {
      dragging.value = false
      document.removeEventListener('mousemove', onMousemove)
      document.removeEventListener('touchmove', onMousemove)
    }

    onMounted(() => {
      containerSize.value = refContainer.value.getBoundingClientRect().width
      document.addEventListener('mouseup', onMouseup)
      document.addEventListener('touchend', onMouseup)
    })

    onUnmounted(() => {
      document.removeEventListener('mouseup', onMouseup)
      document.removeEventListener('touchend', onMouseup)
    })

    watch(
      () => store.getters.windowInnerWidth,
      () => {
        containerSize.value = refContainer.value.getBoundingClientRect().width
      },
    )

    return {
      refContainer,
      ratio,
      handlePos,
      dragging,
      onMousedown,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-slider {
  .app-slider-container {
    width: 100%;
    position: relative;
    user-select: none;
    height: 32px;
    display: flex;
    align-items: center;
    cursor: pointer;

    --bar-height: 8px;
    .bar {
      position: absolute;
      background: linear-gradient(to right, var(--brand-primary), var(--brand-primary-hover-bg));
      width: 100%;
      height: var(--bar-height);
      overflow: hidden;
      border-radius: calc(var(--bar-height) / 2);

      .fill {
        background: var(--brand-primary-bg);
        width: 0;
        height: 100%;
        transition: none;
      }
    }

    --handle-height: 20px;
    .handle {
      position: absolute;
      height: var(--handle-height);
      background: var(--white);
      border-radius: 8px;
      top: 6px;
      pointer-events: none;
      border: 1px solid rgba(0, 0, 0, 0.08);
      box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.32);
      display: flex;
      align-items: center;

      .vr {
        height: 8px;
        width: 1px;
        background: rgba(0, 0, 0, 0.08);
        margin: auto;
      }
    }
  }
}
</style>