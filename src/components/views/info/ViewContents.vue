<template>
  <div class="view-contents view-layout-default">
    <SubHeader :items="contents"/>
    <component :is="selectedComponent"/>
  </div>
</template>

<script>
import { computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

export default {
  components: {
    ViewInfluencers: defineAsyncComponent(() => import('./influencers/ViewInfluencers')),
    ViewInfluencerDetail: defineAsyncComponent(() => import('./influencers/ViewInfluencerDetail')),
  },
  setup() {
    const router = useRouter()

    const contents = computed(() => [{
      path: '/contents/influencers',
      title: 'INFLUENCERS',
    }])

    const selectedComponent = computed(() => {
      const p = router.currentRoute.value.path
      if (p === '/contents/influencers') return 'ViewInfluencers'
      if (p.startsWith('/contents/influencers/')) return 'ViewInfluencerDetail'
    })

    return {
      contents,
      selectedComponent,
    }
  },
}
</script>