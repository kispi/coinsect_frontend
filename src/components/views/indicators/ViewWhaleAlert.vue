<template>
  <div class="view-whale-alert">
    <WhaleAlert/>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    WhaleAlert: defineAsyncComponent(() => import('@/components/common/whale-alert/WhaleAlert')),
  },
}
</script>