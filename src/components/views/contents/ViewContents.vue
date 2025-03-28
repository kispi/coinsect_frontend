<template>
  <div class="view-contents">
    <component :is="selectedComponent" class="view-contents-body p-b-40"/>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

const ViewNews = defineAsyncComponent(() => import('./news/ViewNews'))
const ViewEconomicCalendar = defineAsyncComponent(() => import('./ViewEconomicCalendar'))
const ViewInfluencers = defineAsyncComponent(() => import('./influencers/ViewInfluencers'))
const ViewInfluencerDetail = defineAsyncComponent(() => import('./influencers/ViewInfluencerDetail'))
const ViewPublicTreasury = defineAsyncComponent(() => import('./ViewPublicTreasury'))
const ViewCryptoReferral = defineAsyncComponent(() => import('./ViewCryptoReferral'))

const { router } = useGlobalHooks()

const selectedComponent = computed(() => {
  const p = router.currentRoute.value.path
  if (p === '/contents/news') return ViewNews
  if (p === '/contents/economic-calendar') return ViewEconomicCalendar
  if (p === '/contents/influencers') return ViewInfluencers
  if (p.startsWith('/contents/influencers/')) return ViewInfluencerDetail
  if (p === '/contents/public-treasury') return ViewPublicTreasury
  if (p === '/contents/crypto-referral') return ViewCryptoReferral
})
</script>