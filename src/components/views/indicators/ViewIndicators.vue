<template>
  <div class="view-indicators">
    <component :is="selectedComponent"/>
  </div>
</template>

<script>
import { computed, defineAsyncComponent } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  components: {
    ViewLeaderboard: defineAsyncComponent(() => import('./ViewLeaderboard')),
    ViewRealTimePositions: defineAsyncComponent(() => import('./ViewRealTimePositions')),
    ViewWhaleAlert: defineAsyncComponent(() => import('./ViewWhaleAlert')),
  },
  setup() {
    const { router } = useGlobalHooks()

    const selectedComponent = computed(() => {
      const p = router.currentRoute.value.path
      if (p === '/indicators/leaderboard') return 'ViewLeaderboard'
      if (p === '/indicators/positions') return 'ViewRealTimePositions'
      if (p === '/indicators/whale-alert') return 'ViewWhaleAlert'
    })

    return {
      selectedComponent,
    }
  },
}
</script>