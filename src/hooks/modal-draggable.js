import { ref, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'

const useModalDraggable = () => {
  const store = useStore()

  const dragTarget = ref(null)

  const modalHeader = ref(null)

  const dragging = ref(null)

  const offset = ref({
    x: 0,
    y: 0,
  })

  const onMousemove = e => {
    if (!dragging.value || !dragTarget.value) return

    dragTarget.value.style.top = `${(e.touches ? e.touches[0].clientY : e.clientY) - offset.value.y}px`
    dragTarget.value.style.left = `${(e.touches ? e.touches[0].clientX : e.clientX) - offset.value.x}px`
  }

  const onMousedown = e => {
    if (e.target.classList.contains('fa-times') || e.target.classList.contains('fa-chevron-left')) return

    dragging.value = true
    document.addEventListener('touchmove', onMousemove)
    document.addEventListener('mousemove', onMousemove)

    const rect = e.target.getBoundingClientRect()

    // 헤더 안에서 클릭된 마우스의 위치만큼(offset)을 onMousemove에서 빼주어야함.
    offset.value.x = e.touches ? (e.touches[0].pageX - rect.left) : e.offsetX
    offset.value.y = e.touches ? (e.touches[0].pageY - rect.top) : e.offsetY
  }

  const onMouseup = () => {
    dragging.value = false
    document.removeEventListener('mousemove', onMousemove)
  }

  const makeDraggable = refModal => {
    if (!refModal) return

    setTimeout(() => {
      dragTarget.value = refModal.getElementsByClassName('modal-base-style')[0]
      if (!dragTarget.value) return

      modalHeader.value = dragTarget.value.getElementsByClassName('modal-header')[0]
      if (!modalHeader.value) return

      modalHeader.value.addEventListener('touchstart', onMousedown)
      modalHeader.value.addEventListener('mousedown', onMousedown)
      refModal.classList.add('modal-draggable')

      const modalRect = dragTarget.value.getBoundingClientRect()

      dragTarget.value.style.top = `calc(50% - ${modalRect.height / 2}px)`
      dragTarget.value.style.left = `calc(50% - ${modalRect.width / 2}px)`
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
      modalHeader.value.removeEventListener('touchstart', onMousedown)
      modalHeader.value.removeEventListener('mousedown', onMousedown)
    }
  })

  return {
    makeDraggable,
  }
}

export default useModalDraggable