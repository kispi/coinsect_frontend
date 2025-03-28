<template>
  <div
    class="wrapper-dropdown-overlay"
    @mousedown="slideLeave">
    <transition name="fade">
      <div
        ref="tryToGetMyDirectChildDOM"
        v-show="prepared"
        class="p-absolute"
        :style="{ top, bottom, left, right }">
        <slot/>
      </div>
    </transition>
  </div>
</template>

<script setup>
/**
 * 드롭다운이 열리면, 드롭다운 이외의 영역은 UX가 블록되는것이 일반적으로 기대되는 UX이다.
 * 이 컴포넌트는 클릭시 드롭다운을 꺼주는 백드롭 및 슬라이드 애니메이션을 제공한다.
 * 
 * 사용법:)
 * <WrapperDropdownOverlay
 *   v-if="showDropdown"
 *   :mountBelow="domYouWantToUseAsToggleButton">
 *   ANY CONTENT FOR <slot/>
 * </WrapperDropdownOverlay>
 */
import useGlobalHooks from '@/hooks/global-hooks'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  mountBelow: {
    type: Object,
    default: null,
  },
  align: {
    type: String,
    validator: val => val === 'left' || val === 'center' || val === 'right',
    default: 'left',
  },
})

const emit = defineEmits(['close'])

const { store } = useGlobalHooks()

/**
 * slide-enter: modelValue = true가 되면서 wrapper-dropdown-overlay가 즉시 펼쳐진 뒤, prepared가 뒤이어 true가 되며 이루어짐
 * slide-leave: 먼저 prepared를 false로 하며 약 0.2초간 slide-leave 애니메이션을 기다린 '후에' 비로소 modelValue = false로 하여 wrapper-dropdown-overlay를 감춘다.
 **/
const prepared = ref(null)

const top = ref(null)

const bottom = ref(null)

const left = ref(null)

const right = ref(null)

const tryToGetMyDirectChildDOM = ref(null)

const slotDOM = ref(null)

const slideEnter = () => {
  if (!props.mountBelow) return

  const rectMountBelow = props.mountBelow.getBoundingClientRect()
  slotDOM.value = tryToGetMyDirectChildDOM.value.children[0]
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

const slideLeave = e => {
  if (
    !e ||
    (e.type !== 'resize' && !e.target.classList.contains('wrapper-dropdown-overlay'))
  ) return

  prepared.value = false
  setTimeout(() => emit('close'), 200)
}

watch(
  () => store.getters.scrollTop,
  slideEnter,
)

onMounted(() => {
  if (process.env.VUE_APP_SSR) return

  slideEnter()
  window.addEventListener('resize', slideLeave, { capture: true })
})

onUnmounted(() => {
  if (process.env.VUE_APP_SSR) return

  window.removeEventListener('resize', slideLeave)
})
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