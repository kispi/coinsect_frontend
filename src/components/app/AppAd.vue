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
    <div v-if="$store.getters.windowInnerWidth >= 1200" class="ad-container" :style="forcedStyle">
      <AdSense :dataAdSlot="'3927887162'" :responsive="true" @load="onLoadAdSense"/>
    </div>
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
  .ad-container {
    position: absolute;
    top: 0;
    right: calc(-1 * var(--banner-width) - 16px);
    width: var(--banner-width);

    .ad-sense {
      position: sticky;
      top: calc(var(--app-header-height) + var(--app-default-page-padding));
      height: 600px;
    }
  }
}
</style>