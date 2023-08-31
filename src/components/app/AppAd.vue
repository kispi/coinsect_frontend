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
  </div>
</template>

<style lang="scss">
.app-ad {
  position: relative;
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(3, 1fr);
}
</style>