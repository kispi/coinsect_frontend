<template>
  <div class="view-indicators">
    <component :is="selectedComponent"/>
  </div>
</template>

<script>
import { computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

export default {
  components: {
    ViewRichlist: defineAsyncComponent(() => import('./ViewRichlist')),
    ViewWhaleAlert: defineAsyncComponent(() => import('./ViewWhaleAlert')),
  },
  setup() {
    const router = useRouter()

    const selectedComponent = computed(() => {
      const p = router.currentRoute.value.path
      if (p === '/onchain/richlist') return 'ViewRichlist'
      if (p === '/onchain/whale-alert') return 'ViewWhaleAlert'
    })

    return {
      selectedComponent,
    }
  },
}
</script>