<template>
  <div class="view-main">
    <DashboardsMain
      v-if="prepared"
      ref="refDashboardsMain"
      class="view-main"
    />
    <div
      v-if="!prepared || !connected"
      class="overlay disconnected center">
      <button class="btn btn-primary" @click="reload">재접속</button>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import DashboardsMain from './DashboardsMain'
import useLazyLoads from '@/lazy-loads'

export default {
  components: { DashboardsMain },
  setup() {
    const { loadToastUIEditor } = useLazyLoads()

    const refDashboardsMain = ref(null)

    const prepared = ref(true)

    const connected = ref(true)

    const connections = computed(() => {
      const realTimePriceCards = ((refDashboardsMain.value || {}).refRealTimePriceCards || {}).connection || {}
      return {
        binance: realTimePriceCards.binance,
        upbit: realTimePriceCards.upbit,
        realTimePositions: (refDashboardsMain.value || {}).connectionRealTimePositions,
      }
    })

    const reload = () => {
      prepared.value = false
      connected.value = false

      setTimeout(() => {
        prepared.value = true
        connected.value = true
      }, 100)
    }

    // 업비트는 connection 체크 기준에서 제외
    const checkConnection = () => {
      connected.value = ((connections.value || {}).binance || {}).readyState === 1 &&
        ((connections.value || {}).upbit || {}).readyState === 1 &&
        (refDashboardsMain.value || {}).connectionRealTimePositions.readyState === 1
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkConnection()
        if (!connected.value) reload()
      }
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
      refDashboardsMain,
      prepared,
      connected,
      reload,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-main {
  .overlay.disconnected {
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    z-index: 1;
  }
}
</style>