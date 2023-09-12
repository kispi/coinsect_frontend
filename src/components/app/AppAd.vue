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
    <div
      v-if="$store.getters.windowInnerWidth >= 1200"
      class="ad-sense-container"
      :style="{
        height: $store.getters.stickyAppBodyHeight,
      }">
      <AdSense :dataAdSlot="'3927887162'" :responsive="true"/>
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
  .ad-sense-container {
    position: absolute;
    top: 0;
    right: calc(-1 * var(--banner-width) - 16px);

    .ad-sense {
      position: sticky;
      width: var(--banner-width);
      height: 600px;
      top: calc(var(--app-header-height) + var(--app-default-page-padding));
    }
  }
}
</style>