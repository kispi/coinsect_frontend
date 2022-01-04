<template>
  <div
    class="wrapper-dropdown-overlay"
    :class="displayNoneClassWhen"
    @mousedown="slideLeave">
    <transition name="fade">
      <div
        ref="tryToGetMyDirectChildDOM"
        v-show="prepared"
        class="p-absolute"
        :style="{ top, bottom, left, right }">
        <slot/> <!-- 이 slot에 들어올 element는 가급적 같은 modelValue를 이용하여 v-if로 항상 re-render해주는게 좋다 -->
      </div>
    </transition>
  </div>
</template>

<script>
/**
 * 드롭다운이 열리면, 드롭다운 이외의 영역은 UX가 블록되는것이 일반적으로 기대되는 UX이다.
 * 이 컴포넌트는 클릭시 드롭다운을 꺼주는 백드롭 및 슬라이드 애니메이션을 제공한다.
 * 
 * 사용법:)
 * <WrapperDropdownOverlay
 *   v-model="showDropdown"
 *   :mountBelow="domYouWantToUseAsToggleButton">
 *   ANY CONTENT FOR <slot/>
 * </WrapperDropdownOverlay>
 */
import { onMounted, onUnmounted, ref, watch } from 'vue'

export default {
  props: {
    /**
     * 드롭다운이 열렸는지의 여부. 반드시 부모가 변경해야한다.
     */
    modelValue: Boolean,
    /**
     * 아래에 드롭다운이 그려지기를 원하는 HTMLElement를 넘겨준다.
     */
    mountBelow: null,
    /**
     * true일 시 오버레이가 열리는 위치를 mountBelow의 우측에 맞춘다. (디폴트는 좌측)
     */
    align: {
      type: String,
      validator: val => val === 'left' || val === 'center' || val === 'right',
      default: 'left',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    /**
     * slide-enter: modelValue = true가 되면서 wrapper-dropdown-overlay가 즉시 펼쳐진 뒤, prepared가 뒤이어 true가 되며 이루어짐
     * slide-leave: 먼저 prepared를 false로 하며 약 0.2초간 slide-leave 애니메이션을 기다린 '후에' 비로소 modelValue = false로 하여 wrapper-dropdown-overlay를 감춘다.
     **/
    const prepared = ref(null)

    const top = ref(null)

    const bottom = ref(null)

    const left = ref(null)

    const right = ref(null)

    const observer = ref(null)

    const displayNoneClassWhen = ref('display-none')

    const tryToGetMyDirectChildDOM = ref(null)

    const slotDOM = ref(null)

    const slideEnter = () => {
      if (!props.modelValue) return

      const rectMountBelow = props.mountBelow.getBoundingClientRect()

      displayNoneClassWhen.value = ''
      if (slotDOM.value) {
        if (props.align === 'left') {
          // 오른쪽 창 끝까지의 거리가 모자르다면, 현재 보이는 영역을 넘어가지 않도록 left값을 설정해준다.
          const distanceHor = window.innerWidth - rectMountBelow.x
          if (distanceHor - slotDOM.value.clientWidth < 0) {
            left.value = `${window.innerWidth - slotDOM.value.clientWidth - 16}px` // 16px은 스크롤 너비
          } else {
            left.value = `${rectMountBelow.x}px`
          }
        }

        if (props.align === 'right') {
          right.value = `${window.innerWidth - (rectMountBelow.x + rectMountBelow.width)}px`
        }

        if (props.align === 'center') {
          left.value = `${rectMountBelow.x + (rectMountBelow.width / 2) - (slotDOM.value.clientWidth / 2)}px`
        }

        if (slotDOM.value.clientHeight + rectMountBelow.y + rectMountBelow.height > window.innerHeight) {
          bottom.value = 0
        } else {
          top.value = `${rectMountBelow.y + rectMountBelow.height}px`
        }
      }

      prepared.value = true
    }

    const slideLeaveOnResize = () => {
      if (window.innerWidth < 768) return

      slideLeave()
    }

    const slideLeave = e => {
      if (
        e &&
        e.type !== 'resize' &&
        !e.target.classList.contains('wrapper-dropdown-overlay')
      ) return

      prepared.value = false
      setTimeout(() => {
        emit('update:modelValue', false)
        displayNoneClassWhen.value = 'display-none'
        slotDOM.value = null
      }, 200)
    }

    watch(
      () => props.modelValue,
      newVal => {
        setTimeout(() => newVal ? slideEnter() : slideLeave())
      },
    )

    onMounted(() => {
      if (process.env.VUE_APP_SSR) return

      observer.value = new MutationObserver(mutations => {
        mutations.forEach(m => slotDOM.value = m.target.children[0])

        // <slot/>이 사라지면 top, left도 리셋해준다. (안그러면 트랜지션이 먼저 있던곳에서 날아오는 애니메이션이 됨)
        if (!slotDOM.value) {
          top.value = null
          bottom.value = null
          left.value = null
          right.value = null
        } else {
          slideEnter()
        }
      })

      // slot에 v-if가 걸려있는 않은 경우의 처리
      observer.value.observe(
        tryToGetMyDirectChildDOM.value,
        { childList: true, attributes: true },
      )
      window.addEventListener('resize', slideLeaveOnResize, { capture: true })
    })

    onUnmounted(() => {
      observer.value.disconnect()
      window.removeEventListener('resize', slideLeaveOnResize)
    })

    return {
      top,
      bottom,
      left,
      right,
      prepared,
      displayNoneClassWhen,
      tryToGetMyDirectChildDOM,
      slideLeave,
    }
  },
}
</script>

<style lang="scss" scoped>
.wrapper-dropdown-overlay {
  z-index: 4;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>