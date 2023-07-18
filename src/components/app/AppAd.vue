<template>
  <div class="app-ad">
    <BannerBybit
      @click="$modal.custom({
        component: 'ModalReferral',
        options: { exchange: 'bybit' },
      })"
    />
    <BannerBingx
      @click="$modal.custom({
        component: 'ModalReferral',
        options: { exchange: 'bingx' },
      })"
    />
  </div>
</template>

<style lang="scss">
.app-ad {
  position: relative;
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(2, 1fr);

  @media (max-width: 767px) {
    .promotion {
      display: none;
    }
  }
}
</style>