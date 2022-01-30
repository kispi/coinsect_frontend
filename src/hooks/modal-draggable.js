import { ref, onMounted, onUnmounted } from 'vue'

const useModalDraggable = () => {
  const dragTarget = ref(null)

  const modalHeader = ref(null)

  const dragging = ref(null)

  const draggable = ref(null)

  const offset = ref({
    x: 0,
    y: 0,
  })

  const onMousemove = e => {
    if (e.touches) return

    if (!dragging.value || !dragTarget.value) return

    dragTarget.value.style.top = `${e.clientY - offset.value.y}px`
    dragTarget.value.style.left = `${e.clientX - offset.value.x}px`
  }

  const onMousedown = e => {
    if (e.target.classList.contains('fa-times') || e.target.classList.contains('fa-chevron-left')) return

    dragging.value = true
    document.addEventListener('touchmove', onMousemove)
    document.addEventListener('mousemove', onMousemove)

    offset.value.x = e.offsetX
    offset.value.y = e.offsetY
  }

  const onMouseup = () => {
    dragging.value = false
    document.removeEventListener('mousemove', onMousemove)
  }

  const makeDraggable = refModal => {
    // 이미 이벤트 바인딩된 경우 스킵
    if (!refModal || draggable.value) return

    setTimeout(() => {
      dragTarget.value = refModal.getElementsByClassName('modal-base-style')[0]
      if (!dragTarget.value) return

      modalHeader.value = dragTarget.value.getElementsByClassName('modal-header')[0]
      if (!modalHeader.value) return

      modalHeader.value.addEventListener('touchstart', onMousedown, { passive: true })
      modalHeader.value.addEventListener('mousedown', onMousedown)
      refModal.classList.add('modal-draggable')

      const modalRect = dragTarget.value.getBoundingClientRect()

      dragTarget.value.style.top = `calc(50% - ${modalRect.height / 2}px)`
      dragTarget.value.style.left = `calc(50% - ${modalRect.width / 2}px)`
      draggable.value = true
    }, 100)
  }

  onMounted(() => {
    document.addEventListener('touchend', onMouseup)
    document.addEventListener('mouseup', onMouseup)
  })

  onUnmounted(() => {
    document.removeEventListener('touchend', onMouseup)
    document.removeEventListener('mouseup', onMouseup)

    if (modalHeader.value) {
      modalHeader.value.removeEventListener('touchstart', onMousedown, { passive: true })
      modalHeader.value.removeEventListener('mousedown', onMousedown)
    }
  })

  return {
    makeDraggable,
  }
}

export default useModalDraggable