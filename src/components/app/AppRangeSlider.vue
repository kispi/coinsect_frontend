<template>
  <div
    class="app-range-slider"
    :class="{'skip-even-index': skipEvenIndexLabel}">
    <div class="layout range-strings">
      <div
        class="value"
        :key="value"
        v-for="value in range"
        v-html="value"/>
    </div>
    <div class="p-relative">
      <div
        ref="rangeDots"
        class="layout range-dots m-t-16">
        <div
          @click="setRange(idx)"
          @mousedown="mousedown(idx)"
          @touchstart="mousedown(idx)"
          class="circle-wrapper"
          :key="value"
          v-for="(value, idx) in range">
          <div class="circle-outer">
            <div class="circle-inner"/>
          </div>
        </div>
      </div>
      <div
        :style="{ left, right }"
        class="selected-range">
        <div class="background"/>
        <div v-if="!useOnlyMax" class="handle-dot min" :class="{'dragging': draggingHandle === 'left'}"/>
        <div v-if="!useOnlyMin" class="handle-dot max" :class="{'dragging': draggingHandle === 'right'}"/>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    range: Array, // EX:) const range = [0, 5, 10, 15, 20]
    current: { min: Number, max: Number }, // current selected min, max
    skipEvenIndexLabel: Boolean, // 짝수번째 값들은 작게 보여줄지의 여부
    useOnlyMin: Boolean, // 최솟값만 사용. (우측 핸들 잠금)
    useOnlyMax: Boolean, // 최댓값만 사용. (좌측 핸들 잠금)
    preventedIndices: Array, // 사용할 수 없는 점들이 있을 경우 나열. EX:) const preventedIndices = [0]
  },
  setup(props, { emit }) {
    const store = useStore()

    const min = ref(0)

    const max = ref(props.range.length - 1)
    
    const left = ref(null)

    const right = ref(null)

    const draggingHandle = ref(null)

    const rectWrapper = ref(null)

    const mouseup = () => {
      draggingHandle.value = null
      document.removeEventListener(store.getters.isMobile ? 'touchmove' : 'mousemove', mousemove)
      document.removeEventListener(store.getters.isMobile ? 'touchend' : 'mouseup', mouseup)
    }

    const mousedown = idx => {
      if (idx === min.value && !props.useOnlyMax) draggingHandle.value = 'left'
      if (idx === max.value && !props.useOnlyMin) draggingHandle.value = 'right'
      if (!draggingHandle.value) return

      document.addEventListener(store.getters.isMobile ? 'touchmove' : 'mousemove', mousemove)
      document.addEventListener(store.getters.isMobile ? 'touchend' : 'mouseup', mouseup)
    }

    const mousemove = e => {
      const clientX = store.getters.isMobile ? e.touches[0].clientX : e.clientX
      posDots.value.forEach((dot, idx) => {
        if (Math.abs(dot.left + rectWrapper.value.left - clientX) > 30) return

        setRange(idx)
      })
    }

    const dragLeft = idx => {
      min.value = idx
      left.value = `${posDots.value[idx].left + 2}px`
      emit('change', { min: min.value, max: max.value })
    }

    const dragRight = idx => {
      max.value = idx
      right.value = `${posDots.value[idx].right + 2}px`
      emit('change', { min: min.value, max: max.value })
    }

    const setRange = idx => {
      if ((props.preventedIndices || []).includes(idx)) return

      if (draggingHandle.value === 'left' && idx < max.value) {
        min.value = idx
        left.value = `${posDots.value[idx].left + 2}px`
      }

      if (draggingHandle.value === 'right' && idx > min.value) {
        max.value = idx
        right.value = `${posDots.value[idx].right + 2}px`
      }

      // 드래그하는게 아닌 중간값을 선택한 경우 가까운 핸들을 끌고온다.
      if (!draggingHandle.value) {
        const a = Math.abs(idx - min.value)
        const b = Math.abs(idx - max.value)

        if (props.useOnlyMax) return dragRight(idx)
        if (props.useOnlyMin) return dragLeft(idx)

        if (a < b) return dragLeft(idx)
        if (a >= b) return dragRight(idx)
      }

      if (draggingHandle.value === 'right') dragRight(idx)
      if (draggingHandle.value === 'left') dragLeft(idx)
    }

    // props.current가 들어온 경우 좌우 핸들의 위치를 해당 포지션으로 초기화해준다.
    const initCurrent = () => {
      if (!props.current || typeof props.current.min !== 'number' || typeof props.current.max !== 'number') return

      min.value = props.current.min
      left.value = `${posDots.value[min.value].left + 2}px`
      max.value = props.current.max
      right.value = `${posDots.value[max.value].right + 2}px`
    }

    const rangeDots = ref(null)

    const posDots = ref([])

    const init = () => {
      setTimeout(() => {
        if (!rangeDots.value) return

        rectWrapper.value = rangeDots.value.getBoundingClientRect()

        posDots.value = []
        rangeDots.value.getElementsByClassName('circle-wrapper')
          .forEach(circleWrapperDom => {
            const rect = circleWrapperDom.getBoundingClientRect()
            posDots.value.push({
              left: rect.left - rectWrapper.value.left,
              right: rectWrapper.value.right - rect.right,
            })
          })

        initCurrent()
      }, 200)
    }

    watch(
      () => props.current,
      (newVal, oldVal) => {
        // current range가 바뀌지 않은 경우 렌더링 X
        if (newVal && oldVal && JSON.stringify(newVal) === JSON.stringify(oldVal)) return

        init()
      },
    )

    watch(
      () => store.getters.windowInnerWidth,
      init,
    )

    onMounted(() => {
      init()
    })

    return {
      min,
      max,
      left,
      right,
      setRange,
      rangeDots,
      posDots,
      mousedown,
      rectWrapper,
      draggingHandle,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-range-slider {
  --circle-size: 28px;
  --handle-padding: 4px;

  .layout {
    display: flex;
    justify-content: space-between;
    user-select: none;

    .value,
    .circle-wrapper {
      width: 40px;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .value {
    font-size: 12px;
    color: var(--dark-gray-lv1);
  }

  .circle-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover .circle-outer {
      background: var(--brand-primary-bg-lv1);
      border-radius: 50%;
    }

    .circle-outer {
      display: flex;
      justify-content: center;
      align-items: center;
      width: var(--circle-size);
      height: var(--circle-size);
      transition: none;

      .circle-inner {
        width: calc(var(--circle-size) / 2);
        height: calc(var(--circle-size) / 2);
        border-radius: calc(var(--circle-size) / 4);
        background: var(--disable-bg);
      }
    }
  }

  .range-dots,
  .selected-range {
    height: calc(var(--circle-size) + (var(--handle-padding) * 2));
  }

  .selected-range {
    position: absolute;
    pointer-events: none;
    top: 0;
    left: calc(var(--handle-padding) / 2);
    right: calc(var(--handle-padding) / 2);
    transition: all 0.1s ease-in;

    .background {
      border-radius: calc((var(--circle-size) + var(--handle-padding) * 2) / 2);
      opacity: 0.64;
      background: linear-gradient(to left, var(--calm-blue), rgba(126, 113, 221, 0.5));
      width: 100%;
      height: 100%;
    }
  }

  .handle-dot {
    background: var(--white);
    width: var(--circle-size);
    height: var(--circle-size);
    position: absolute;
    top: var(--handle-padding);
    border-radius: 50%;
    cursor: pointer;

    &.min {
      left: var(--handle-padding);
    }

    &.max {
      right: var(--handle-padding);
    }

    &.dragging {
      box-shadow: 0 2px 8px var(--brand-primary);
    }

    @media (max-width: 767px) {
      box-shadow: 0 2px 8px var(--brand-primary);
    }
  }

  &.skip-even-index {
    .range-strings {
      .value:nth-child(even) {
        display: none;
      }
    }

    .range-dots {
      .circle-wrapper:nth-child(even) {
        .circle-inner {
          width: 6px;
          height: 6px;
        }
      }
    }
  }
}
</style>