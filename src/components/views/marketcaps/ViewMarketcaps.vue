<template>
  <div class="view-marketcaps">
    <div class="settings default-page-padding">
      <div class="source">
        {{ $translate('SOURCE') }}
        <AppDropdown
          :dropdownItems="sources"
          @select-dropdown-item="setSource"
        />
      </div>
      <div class="currency">
        {{ $translate('CURRENCY') }}
        <AppDropdown
          :dropdownItems="currencies"
          @select-dropdown-item="o => currency = o.key"
        />
      </div>
    </div>
    <AppLoading :loading="$store.getters.loading.marketcaps"/>
    <component
      :is="componentIs"
      :currency="currency"
    />
  </div>
</template>

<script>
import { computed, getCurrentInstance, ref } from 'vue'
import MarketcapsUpbit from './MarketcapsUpbit'
import MarketcapsCoinmarketcap from './MarketcapsCoinmarketcap'

export default {
  components: {
    MarketcapsUpbit,
    MarketcapsCoinmarketcap,
  },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const source = ref('upbit')

    const sources = ref(['upbit', 'coinmarketcap'].map(key => ({ key })))

    const setSource = item => source.value = item.key

    const currency = ref('krw')

    const currencies = ref(['krw', 'usd'].map(key => ({ key })))

    const componentIs = computed(() => `Marketcaps${plugins.$helpers.template.case.toCapital(source.value)}`)

    return {
      sources,
      componentIs,
      currency,
      currencies,
      setSource,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-marketcaps {
  max-width: 1200px;
  margin: auto;

  .settings {
    display: flex;
    justify-content: space-between;

    .source,
    .currency {
      display: flex;
      align-items: center;

      .app-dropdown {
        text-transform: uppercase;
      }
    }
  }
}
</style>