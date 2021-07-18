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
      class="marketcaps-common"
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

<style lang="scss">
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

  .marketcaps-common {
    table {
      border-collapse: collapse;
      width: 100%;
      
      td,
      th {
        padding: 8px;

        &:not(:first-child) {
          text-align: right;
        }

        @media (max-width: 767px) {
          font-size: 12px;
        }
      }

      .ticker {
        display: flex;
        align-items: center;

        .rank {
          min-width: 24px;
          text-align: center;
          margin-right: 4px;
          font-weight: 700;
        }

        img,
        .symbol {
          margin-right: 8px;
        }

        img {
          width: 16px;
        }

        .symbol {
          white-space: nowrap;
          font-weight: 700;
        }

        .full-name {
          color: var(--gray-light);
        }
      }

      @media (max-width: 479px) {
        .ticker {
          max-width: 160px;
        }

        .vol-24,
        .marketcaps {
          letter-spacing: -0.8px;
        }
      }

      tr {
        &:hover {
          background: var(--brand-primary-bg-lv1);
        }
      }
    }
  }
}
</style>