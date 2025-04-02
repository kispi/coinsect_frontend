import { ref, onMounted, onUnmounted } from 'vue'

const useModalDraggable = () => {
  const dragTarget = ref<HTMLElement | null>(null)

  const modalHeader = ref<HTMLElement| null>(null)

  const dragging = ref(false)

  const draggable = ref(false)

  const selectors = ref({ toMove: '', toGrab: '' })

  const offset = ref({
    x: 0,
    y: 0,
  })

  const onMousemove = (e: MouseEvent) => {
    if (!dragging.value || !dragTarget.value) return
    
    dragTarget.value.style.top = `${e.clientY - offset.value.y}px`
    dragTarget.value.style.left = `${e.clientX - offset.value.x}px`
  }

  const onMousedown = (e: MouseEvent) => {
    if (!(e.target as HTMLElement).classList.contains(selectors.value.toGrab)) return

    // 드래그할때 채팅창이나 본문 등이 선택되어 스크롤되는 것을 방지
    dragging.value = true
    const body = document.getElementsByTagName('body')[0]
    body.classList.add('no-select')

    document.addEventListener('mousemove', onMousemove)

    offset.value.x = e.offsetX
    offset.value.y = e.offsetY
  }

  const onMouseup = () => {
    dragging.value = false
    const body = document.getElementsByTagName('body')[0]
    body.classList.remove('no-select')

    document.removeEventListener('mousemove', onMousemove)
  }

  const makeDraggable = (refModal: HTMLElement, classes: { toMove: string, toGrab: string }) => {
    if (!refModal || !classes) return

    selectors.value = classes

    setTimeout(() => {
      dragTarget.value = refModal.getElementsByClassName(selectors.value.toMove)[0] as HTMLElement
      if (!dragTarget.value) return

      modalHeader.value = dragTarget.value.getElementsByClassName(selectors.value.toGrab)[0] as HTMLElement
      if (!modalHeader.value) return

      modalHeader.value.addEventListener('mousedown', onMousedown)

      if (selectors.value.toMove === 'modal-base-style') {
        refModal.classList.add('modal-draggable')
        const modalRect = dragTarget.value.getBoundingClientRect()
        dragTarget.value.style.top = `calc(50% - ${modalRect.height / 2}px)`
        dragTarget.value.style.left = `calc(50% - ${modalRect.width / 2}px)`
      }
      draggable.value = true
    }, 100)
  }

  onMounted(() => {
    document.addEventListener('mouseup', onMouseup)
  })

  onUnmounted(() => {
    document.removeEventListener('mouseup', onMouseup)

    if (modalHeader.value) {
      modalHeader.value.removeEventListener('mousedown', onMousedown)
    }
  })

  return {
    makeDraggable,
  }
}

export default useModalDraggable