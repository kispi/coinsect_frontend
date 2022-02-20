<template>
  <div class="view-contents">
    <SubHeader :items="contents"/>
    <component :is="selectedComponent" class="view-contents-body"/>
  </div>
</template>

<script>
import { computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

export default {
  components: {
    ViewBitcoinHalving: defineAsyncComponent(() => import('./ViewBitcoinHalving')),
    ViewNews: defineAsyncComponent(() => import('./ViewNews')),
    ViewInfluencers: defineAsyncComponent(() => import('./influencers/ViewInfluencers')),
    ViewInfluencerDetail: defineAsyncComponent(() => import('./influencers/ViewInfluencerDetail')),
    ViewPublicTreasury: defineAsyncComponent(() => import('./ViewPublicTreasury')),
  },
  setup() {
    const router = useRouter()

    const contents = computed(() => [{
      path: '/contents/news',
      title: 'NEWS',
    }, {
      path: '/contents/influencers',
      title: 'INFLUENCERS',
    }, {
      path: '/contents/public-treasury',
      title: 'PUBLIC_TREASURY',
    }, {
      path: '/contents/bitcoin-halving',
      title: 'BITCOIN_HALVING',
    }])

    const selectedComponent = computed(() => {
      const p = router.currentRoute.value.path
      if (p === '/contents/news') return 'ViewNews'
      if (p === '/contents/influencers') return 'ViewInfluencers'
      if (p.startsWith('/contents/influencers/')) return 'ViewInfluencerDetail'
      if (p === '/contents/public-treasury') return 'ViewPublicTreasury'
      if (p === '/contents/bitcoin-halving') return 'ViewBitcoinHalving'
    })

    return {
      contents,
      selectedComponent,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-contents {
  .view-contents-body {
    padding-bottom: 40px;
  }
}
</style>