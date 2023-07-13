<template>
  <div class="ad-exchanges">
    <BannerBybit @click="openModalReferral('BYBIT')"/>
    <BannerBingx @click="openModalReferral('BINGX')"/>
  </div>
</template>

<script>
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { plugins } = useGlobalHooks()

    const openModalReferral = exchange => plugins.$modal.custom({
      component: 'ModalReferral',
      options: { exchange },
    })

    return {
      openModalReferral,
    }
  },
}
</script>

<style lang="scss" scoped>
.ad-exchanges {
  display: grid;
  gap: 8px;
}
</style>