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
  },
  setup() {
    const router = useRouter()

    const selectedComponent = computed(() => {
      const p = router.currentRoute.value.path
      if (p === '/onchain/richlist') return 'ViewRichlist'
    })

    return {
      selectedComponent,
    }
  },
}
</script>