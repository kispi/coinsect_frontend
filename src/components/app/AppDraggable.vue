<template>
  <div
    class="app-draggable"
    @mousedown="mousedown">
    <slot/>
    <div class="dragging-element-fixed-overlay">
      <div
        v-if="draggingContainer.style"
        class="dragging-element"
        :src="draggingContainer.target.src"
        :style="draggingContainer.style">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * <slot/>으로 들어온 컴포넌트를 draggable하게 만들어주는 컴포넌트.
 *
 * 사용법:)
 * <AppDraggable>
 *   <아무 HTMLElement/>
 * </AppDraggable>
 */
import { ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

const emit = defineEmits(['app-draggable-move'])

const { store } = useGlobalHooks()

const draggingContainer = ref({
  target: null,
  style: null,
  offset: null,
  size: null,
})

const dragging = ref(null)

const mousemove = e => {
  if (!store.getters.isMobile) e.preventDefault()

  if (!dragging.value) return

  const clientX = e.clientX
  const clientY = e.clientY

  draggingContainer.value.style = {
    left: `${clientX - draggingContainer.value.offset.x}px`,
    top: `${clientY - draggingContainer.value.offset.y}px`,
    width: `${draggingContainer.value.size.width}px`,
    height: `${draggingContainer.value.size.height}px`,
  }

  draggingContainer.value.target.classList.add('dragging')

  emit('app-draggable-move', e)
}

const mouseup = () => {
  dragging.value = false
  draggingContainer.value.target.classList.remove('dragging')
  draggingContainer.value.target = null
  draggingContainer.value.style = null
  draggingContainer.value.offset = null
  draggingContainer.value.size = null
  document.removeEventListener('mousemove', mousemove)
  document.removeEventListener('mouseup', mouseup)
}

const mousedown = e => {
  dragging.value = true
  const rect = e.target.getBoundingClientRect()
  if (!rect) return

  draggingContainer.value.size = {
    width: rect.width,
    height: rect.height,
  }

  const offsetX = e.offsetX
  const offsetY = e.offsetY

  draggingContainer.value.target = e.target
  draggingContainer.value.offset = {
    x: offsetX,
    y: offsetY,
  }

  document.addEventListener('mousemove', mousemove)
  document.addEventListener('mouseup', mouseup)
}
</script>

<style lang="scss">
.app-draggable {
  .dragging-element-fixed-overlay {
    position: fixed;
    pointer-events: none;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;

    .dragging-element {
      position: absolute;
      transition: none;
    }
  }

  .dragging {
    opacity: 0.5;
  }
}
</style>