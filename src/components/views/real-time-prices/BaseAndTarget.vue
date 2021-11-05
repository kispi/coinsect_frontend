<template>
  <div class="base-and-target">
    <div class="base-exchange">
      {{ $translate('BASE_EXCHANGE') }}
      <AppDropdown
        class="m-l-8"
        :dropdownItems="bases"
        @select-dropdown-item="o => {
          $store.commit('setSettings', { baseExchange: o.key })
          $emit('change-base-exchange')
        }"
      />
    </div>
    <div class="target-exchange">
      {{ $translate('TARGET_EXCHANGE') }}
      <AppDropdown
        class="m-l-8"
        :dropdownItems="targets"
        :align="'right'"
        @select-dropdown-item="o => {
          $store.commit('setSettings', { targetExchange: o.key })
          $emit('change-target-exchange')
        }"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const bases = ref([{
      key: 'upbit',
      img: require('@/assets/images/upbit.svg'),
    }, {
      key: 'bithumb',
      img: require('@/assets/images/bithumb.png'),
    }].map(o => ({
      ...o,
      $$selected: o.key === store.getters.settings.baseExchange,
    })))

    const targets = ref([{
      key: 'binance',
      img: require('@/assets/images/binance.svg'),
    }].map(o => ({
      ...o,
      $$selected: o.key === store.getters.settings.targetExchange,
    })))

    return {
      bases,
      targets,
    }
  }
}
</script>

<style lang="scss" scoped>
.base-and-target {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .base-exchange,
  .target-exchange {
    display: flex;
    align-items: center;
  }
}
</style>