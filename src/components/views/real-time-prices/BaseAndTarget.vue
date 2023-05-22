<template>
  <div class="base-and-target">
    <AppDropdown
      :dropdownItems="bases"
      @select-dropdown-item="onSelectBaseExchange"
    />
    <div><i class="fal fa-exchange"/></div>
    <AppDropdown
      :dropdownItems="targets"
      :align="'right'"
      @select-dropdown-item="o => {
        $store.commit('setSettings', { targetExchange: o.key })
      }"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { store } = useGlobalHooks()

    const bases = ref([{
      key: 'upbit_krw',
      img: require('@/assets/images/upbit.svg'),
    }, {
      key: 'upbit_btc',
      img: require('@/assets/images/upbit.svg'),
    }, {
      key: 'bithumb_krw',
      img: require('@/assets/images/bithumb.svg'),
    }].map(o => ({
      ...o,
      $$selected: o.key === `${store.getters.settings.baseExchange}_${store.getters.settings.baseExchangeMarket}`.toLowerCase(),
    })))

    const targets = ref([{
      key: 'binance',
      name: 'BINANCE_USDT',
      img: require('@/assets/images/binance.svg'),
    }].map(o => ({
      ...o,
      $$selected: o.key === store.getters.settings.targetExchange,
    })))

    const onSelectBaseExchange = o => {
      const [baseExchange, baseExchangeMarket] = o.key.split('_')
      store.commit('setSettings', {
        baseExchange,
        baseExchangeMarket,
      })
    }

    return {
      bases,
      targets,
      onSelectBaseExchange,
    }
  }
}
</script>

<style lang="scss" scoped>
.base-and-target {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .fa-exchange {
    font-size: 12px;
    margin: 0 16px;
  }
}
</style>