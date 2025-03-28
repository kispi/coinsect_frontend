<template>
  <div class="view-markets">
    <component :is="selectedComponent"/>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

const ViewCrypto = defineAsyncComponent(() => import('./crypto/ViewCrypto'))
const ViewNasdaq = defineAsyncComponent(() => import('./nasdaq/ViewNasdaq'))
const ViewKospi = defineAsyncComponent(() => import('./kospi/ViewKospi'))
const ViewAssetsIncludingMetal = defineAsyncComponent(() => import('./ViewAssetsIncludingMetal'))

const { router } = useGlobalHooks()

const selectedComponent = computed(() => {
  const p = router.currentRoute.value.path
  if (p === '/markets/crypto') return ViewCrypto
  if (p === '/markets/nasdaq') return ViewNasdaq
  if (p === '/markets/kospi') return ViewKospi
  if (p === '/markets/assets-including-metal') return ViewAssetsIncludingMetal
})
</script>