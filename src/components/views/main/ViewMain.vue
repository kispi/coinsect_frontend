<template>
  <DashboardsMain v-if="prepared" class="view-main"/>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'
import DashboardsMain from './DashboardsMain'
import useLazyLoads from '@/lazy-loads'

export default {
  components: { DashboardsMain },
  setup() {
    const { loadToastUIEditor } = useLazyLoads()

    const prepared = ref(true)

    const onVisibilityChange = () => {
      prepared.value = document.visibilityState === 'visible'
    }

    onMounted(() => {
      // 여기서 미리 로드해둬야 글쓰기를 눌렀을 때 빠르게 로드됨
      loadToastUIEditor()

      document.addEventListener('visibilitychange', onVisibilityChange)
    })

    onUnmounted(() => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
    })

    return {
      prepared,
    }
  },
}
</script>