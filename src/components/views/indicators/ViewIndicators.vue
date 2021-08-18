<template>
  <div class="view-indicators">
    <div class="indicators">
      <div
        @click="$router.push(indicator.path)"
        class="indicator"
        :class="{'selected': indicator.path === $route.path}"
        :key="indicator.path"
        v-for="indicator in indicators">
        {{ $translate(indicator.title) }}
      </div>
    </div>
    <component :is="selectedComponent"/>
  </div>
</template>

<script>
import { computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

export default {
  components: {
    ViewMarketcaps: defineAsyncComponent(() => import('@/components/views/indicators/marketcaps/ViewMarketcaps')),
  },
  setup() {
    const router = useRouter()

    const indicators = computed(() => [{
    //   path: '/indicators/general',
    //   title: 'GENERAL',
    // }, {
      path: '/indicators/marketcaps',
      title: 'MARKETCAPS',
    }])

    const selectedComponent = computed(() => {
      const p = router.currentRoute.value.path
      if (p === '/indicators/general') return 'ViewGeneral'
      if (p === '/indicators/marketcaps') return 'ViewMarketcaps'
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
  padding: var(--app-default-page-padding);
  max-width: 992px;
  margin: auto;

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