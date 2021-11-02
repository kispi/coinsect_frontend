<template>
  <div class="view-info view-layout-default">
    <div class="sub-header-items">
      <div
        @click="$router.push(indicator.path)"
        class="sub-header-item"
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
    ViewInfluencers: defineAsyncComponent(() => import('./influencers/ViewInfluencers')),
  },
  setup() {
    const router = useRouter()

    const indicators = computed(() => [{
      path: '/info/influencers',
      title: 'INFLUENCERS',
    }])

    const selectedComponent = computed(() => {
      const p = router.currentRoute.value.path
      if (p === '/info/influencers') return 'ViewInfluencers'
    })

    return {
      indicators,
      selectedComponent,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-info {
}
</style>