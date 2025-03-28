<template>
  <div class="view-apps">
    <component :is="selectedComponent"/>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

const ViewPortfolio = defineAsyncComponent(() => import('./ViewPortfolio'))
const ViewGames = defineAsyncComponent(() => import('./ViewGames'))
const ViewLottery = defineAsyncComponent(() => import('./lottery/ViewLottery'))
const ViewSeo = defineAsyncComponent(() => import('./ViewSeo'))
const ViewSalary = defineAsyncComponent(() => import('./ViewSalary'))
const ViewVoiceRecorder = defineAsyncComponent(() => import('./ViewVoiceRecorder'))
const ViewImageResizer = defineAsyncComponent(() => import('./ViewImageResizer'))
const ViewImageModeration = defineAsyncComponent(() => import('./ViewImageModeration'))

const { router } = useGlobalHooks()

const selectedComponent = computed(() => {
  const p = router.currentRoute.value.path
  if (p === '/apps/portfolio') return ViewPortfolio
  if (p === '/apps/salary') return ViewSalary
  if (p === '/apps/lottery') return ViewLottery
  if (p === '/apps/seo') return ViewSeo
  if (p === '/apps/games') return ViewGames
  if (p === '/apps/voice-recorder') return ViewVoiceRecorder
  if (p === '/apps/image-resizer') return ViewImageResizer
  if (p === '/apps/image-moderation') return ViewImageModeration
})
</script>