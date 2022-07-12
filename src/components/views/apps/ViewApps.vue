<template>
  <div class="view-apps">
    <component :is="selectedComponent"/>
  </div>
</template>

<script>
import { computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

export default {
  components: {
    ViewPortfolio: defineAsyncComponent(() => import('./ViewPortfolio')),
    ViewGames: defineAsyncComponent(() => import('./ViewGames')),
    ViewLottery: defineAsyncComponent(() => import('./lottery/ViewLottery')),
    ViewSalary: defineAsyncComponent(() => import('./ViewSalary')),
    ViewVoiceRecorder: defineAsyncComponent(() => import('./ViewVoiceRecorder')),
  },
  setup() {
    const router = useRouter()

    const selectedComponent = computed(() => {
      const p = router.currentRoute.value.path
      if (p === '/apps/portfolio') return 'ViewPortfolio'
      if (p === '/apps/salary') return 'ViewSalary'
      if (p === '/apps/lottery') return 'ViewLottery'
      if (p === '/apps/games') return 'ViewGames'
      if (p === '/apps/voice-recorder') return 'ViewVoiceRecorder'
    })

    return {
      selectedComponent,
    }
  },
}
</script>