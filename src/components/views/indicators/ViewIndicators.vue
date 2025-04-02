<template>
  <div class="view-indicators">
    <component :is="selectedComponent"/>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

const ViewLeaderboard = defineAsyncComponent(() => import('./ViewLeaderboard.vue'))
const ViewRealTimePositions = defineAsyncComponent(() => import('./ViewRealTimePositions.vue'))
const ViewWhaleAlert = defineAsyncComponent(() => import('./ViewWhaleAlert.vue'))

const { router } = useGlobalHooks()

const selectedComponent = computed(() => {
  const p = router.currentRoute.value.path
  if (p === '/indicators/leaderboard') return ViewLeaderboard
  if (p === '/indicators/positions') return ViewRealTimePositions
  if (p === '/indicators/whale-alert') return ViewWhaleAlert
})
</script>