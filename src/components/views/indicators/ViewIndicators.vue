<template>
  <div class="view-indicators view-layout-default">
    <SubHeader :items="indicators"/>
    <component :is="selectedComponent"/>
  </div>
</template>

<script>
import { computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

export default {
  components: {
    ViewGeneral: defineAsyncComponent(() => import('./general/ViewGeneral')),
    ViewLeaderboard: defineAsyncComponent(() => import('./ViewLeaderboard')),
    ViewMarketcaps: defineAsyncComponent(() => import('./marketcaps/ViewMarketcaps')),
  },
  setup() {
    const router = useRouter()

    const indicators = computed(() => [{
      path: '/indicators/leaderboard',
      title: 'LEADERBOARD',
    }, {
      path: '/indicators/marketcaps',
      title: 'MARKETCAPS',
    }, {
      path: '/indicators/general',
      title: 'GENERAL',
    }])

    const selectedComponent = computed(() => {
      const p = router.currentRoute.value.path
      if (p === '/indicators/leaderboard') return 'ViewLeaderboard'
      if (p === '/indicators/marketcaps') return 'ViewMarketcaps'
      if (p === '/indicators/general') return 'ViewGeneral'
    })

    return {
      indicators,
      selectedComponent,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-indicators {
  .indicators {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .indicator {
      padding: 8px;
      cursor: pointer;
      border-bottom: 2px solid transparent;

      &.selected {
        color: var(--text-stress);
        font-weight: 700;
        border-bottom: 2px solid var(--brand-primary);
      }
    }
  }
}
</style>