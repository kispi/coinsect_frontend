<template>
  <div class="view-contents">
    <component :is="selectedComponent" class="view-contents-body p-b-40"/>
  </div>
</template>

<script>
import { computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

export default {
  components: {
    ViewBitcoinHalving: defineAsyncComponent(() => import('./ViewBitcoinHalving')),
    ViewBitcoinMining: defineAsyncComponent(() => import('./ViewBitcoinMining')),
    ViewNews: defineAsyncComponent(() => import('./news/ViewNews')),
    ViewTwitter: defineAsyncComponent(() => import('./ViewTwitter')),
    ViewEconomicCalendar: defineAsyncComponent(() => import('./ViewEconomicCalendar')),
    ViewInfluencers: defineAsyncComponent(() => import('./influencers/ViewInfluencers')),
    ViewInfluencerDetail: defineAsyncComponent(() => import('./influencers/ViewInfluencerDetail')),
    ViewPublicTreasury: defineAsyncComponent(() => import('./ViewPublicTreasury')),
    ViewCryptoReferral: defineAsyncComponent(() => import('./ViewCryptoReferral')),
  },
  setup() {
    const router = useRouter()

    const selectedComponent = computed(() => {
      const p = router.currentRoute.value.path
      if (p === '/contents/news') return 'ViewNews'
      if (p === '/contents/twitter') return 'ViewTwitter'
      if (p === '/contents/economic-calendar') return 'ViewEconomicCalendar'
      if (p === '/contents/influencers') return 'ViewInfluencers'
      if (p.startsWith('/contents/influencers/')) return 'ViewInfluencerDetail'
      if (p === '/contents/public-treasury') return 'ViewPublicTreasury'
      if (p === '/contents/bitcoin-halving') return 'ViewBitcoinHalving'
      if (p === '/contents/bitcoin-mining') return 'ViewBitcoinMining'
      if (p === '/contents/crypto-referral') return 'ViewCryptoReferral'
    })

    return {
      selectedComponent,
    }
  },
}
</script>