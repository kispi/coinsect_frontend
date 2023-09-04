<template>
  <div class="app-ad">
    <ExchangeBanner
      @click="$modal.custom({
        component: 'ModalReferral',
        options: { exchange },
      })"
      :exchange="exchange"
      :simple="$store.getters.isMobile"
      :key="exchange"
      v-for="exchange in ['bybit', 'bitget', 'bingx']"
    />
    <AdSense v-if="$store.getters.windowInnerWidth >= 1200" :dataAdSlot="'3927887162'" :responsive="true"/>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const forcedStyle = ref(null)

    const onLoadAdSense = () => {
      setTimeout(() => forcedStyle.value = { height: '960px !important' }, 500)
    }

    return {
      forcedStyle,
      onLoadAdSense,
    }
  },
}
</script>

<style lang="scss">
.app-ad {
  position: relative;
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(3, 1fr);

  --banner-width: 300px;
  .ad-sense {
    position: fixed;
    top: calc(var(--app-header-height) + var(--app-default-page-padding));
    right: calc((100vw - 1200px) / 2 - var(--banner-width) - 16px);
    width: var(--banner-width);
    height: 600px;
  }
}
</style>