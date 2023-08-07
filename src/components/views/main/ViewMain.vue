<template>
  <DashboardsMain class="view-main" v-if="prepared"/>
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

    onMounted(() => {
      // 여기서 미리 로드해둬야 글쓰기를 눌렀을 때 빠르게 로드됨
      loadToastUIEditor()
    })

    return {
      prepared,
    }
  },
}
</script>