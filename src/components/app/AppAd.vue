<template>
  <div class="app-ad">
    <template v-if="whereToShow">
      <ExchangeBanner
        @click="helpers.modal.custom({
          component: 'ModalReferral',
          options: { exchange },
        })"
        :exchange="exchange"
        :simple="store.getters.isMobile"
        :key="exchange"
        v-for="exchange in ['bybit', 'bitget', 'bingx']"
      />
    </template>
    <!-- <AdSense v-if="store.getters.windowInnerWidth >= 1200" :dataAdSlot="'3927887162'" :responsive="true"/> -->
    <AppCoupang v-if="store.getters.windowInnerWidth >= 1200" :width="300" :height="800"/>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

const { helpers, store } = useGlobalHooks()

const whereToShow = computed(() => false)
</script>

<style lang="scss">
.app-ad {
  position: relative;
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(3, 1fr);

  --banner-width: 300px;
  // .ad-sense {
  .app-coupang {
    position: fixed;
    top: calc(var(--app-header-height) + var(--app-default-page-padding));
    right: calc((100vw - 1200px) / 2 - var(--banner-width) - 16px);
    width: var(--banner-width);
    height: 600px;
  }
}
</style>