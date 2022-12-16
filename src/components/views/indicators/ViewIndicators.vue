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
    ViewGeneral: defineAsyncComponent(() => import('./general/ViewGeneral')),
    ViewLeaderboard: defineAsyncComponent(() => import('./ViewLeaderboard')),
    ViewLongShort: defineAsyncComponent(() => import('./ViewLongShort')),
    ViewRealTimePositions: defineAsyncComponent(() => import('./ViewRealTimePositions')),
  },
  setup() {
    const { router } = useGlobalHooks()

    const selectedComponent = computed(() => {
      const p = router.currentRoute.value.path
      if (p === '/indicators/general') return 'ViewGeneral'
      if (p === '/indicators/leaderboard') return 'ViewLeaderboard'
      if (p === '/indicators/long-short') return 'ViewLongShort'
      if (p === '/indicators/real-time-positions') return 'ViewRealTimePositions'
    })

    return {
      selectedComponent,
    }
  },
}
</script>