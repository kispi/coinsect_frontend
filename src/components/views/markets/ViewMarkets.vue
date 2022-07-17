<template>
  <div class="view-markets">
    <component :is="selectedComponent"/>
  </div>
</template>

<script>
import { computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

export default {
  components: {
    ViewCrypto: defineAsyncComponent(() => import('./crypto/ViewCrypto')),
    ViewNasdaq: defineAsyncComponent(() => import('./nasdaq/ViewNasdaq')),
    ViewAssetsIncludingMetal: defineAsyncComponent(() => import('./ViewAssetsIncludingMetal')),
  },
  setup() {
    const router = useRouter()

    const selectedComponent = computed(() => {
      const p = router.currentRoute.value.path
      if (p === '/markets/crypto') return 'ViewCrypto'
      if (p === '/markets/nasdaq') return 'ViewNasdaq'
      if (p === '/markets/assets-including-metal') return 'ViewAssetsIncludingMetal'
    })

    return {
      selectedComponent,
    }
  },
}
</script>