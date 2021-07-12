import { ref, computed, onMounted, onUnmounted } from 'vue'

const useModalMedia = (medias, selectedIndex) => {
  const chevronLeft = computed(() => currentIndex.value <= 0 ? 'o-0' : 'cursor-pointer')

  const chevronRight = computed(() => currentIndex.value >= medias.length - 1 ? 'o-0' : 'cursor-pointer')

  const currentIndex = ref(0)

  const onClickLeft = () => {
    if (currentIndex.value > 0) currentIndex.value--
  }

  const onClickRight = () => {
    if (currentIndex.value < medias.length - 1) currentIndex.value++
  }

  const onKeydown = event => {
    event.preventDefault()
    if (event.keyCode === 37 || event.keyCode === 38) {
      onClickLeft()
    }
    if (event.keyCode === 39 || event.keyCode === 40) {
      onClickRight()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeydown)
    if (selectedIndex !== undefined) {
      currentIndex.value = selectedIndex
    }
  })

  onUnmounted(() => window.removeEventListener('keydown', onKeydown))

  return {
    currentIndex,
    chevronLeft,
    chevronRight,
    onClickLeft,
    onClickRight,
  }
}

export default useModalMedia