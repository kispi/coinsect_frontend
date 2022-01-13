<template>
  <div class="ad-sense">
    <ins class="adsbygoogle"
      data-ad-client="ca-pub-3069752836489386"
      :data-ad-slot="dataAdSlot"
      data-full-width-responsive="true"
    />
  </div>
</template>

<script>
import { onMounted } from 'vue'

export default {
  props: {
    dataAdSlot: String,
  },
  setup() {
    onMounted(() => {
      (adsbygoogle = window.adsbygoogle || []).push({})
    })
  },
}
</script>