<template>
  <div class="view-apps">
    <SubHeader :items="apps"/>
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
    ViewSalary: defineAsyncComponent(() => import('./ViewSalary')),
  },
  setup() {
    const router = useRouter()

    const apps = computed(() => [{
      path: '/apps/portfolio',
      title: 'PORTFOLIO',
    }, {
      path: '/apps/salary',
      title: 'SALARY',
    }, {
      path: '/apps/games',
      title: 'GAMES',
    }])

    const selectedComponent = computed(() => {
      const p = router.currentRoute.value.path
      if (p === '/apps/portfolio') return 'ViewPortfolio'
      if (p === '/apps/salary') return 'ViewSalary'
      if (p === '/apps/games') return 'ViewGames'
    })

    return {
      apps,
      selectedComponent,
    }
  },
}
</script>