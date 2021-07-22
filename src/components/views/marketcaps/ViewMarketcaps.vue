<template>
  <div class="view-marketcaps">
    <div class="settings">
      <div class="source">
        Powered by <a href="https://coingecko.com" target="_blank">Coingecko<img src="@/assets/images/coingecko.png"></a>
      </div>
      <div class="currency">
        {{ $translate('CURRENCY') }}
        <AppDropdown
          class="m-l-8"
          :dropdownItems="currencies"
          @select-dropdown-item="o => currency = o.key"
        />
      </div>
    </div>
    <AppLoading :loading="$store.getters.loading.marketcaps"/>
    <MarketcapsCoingecko
      class="marketcaps-common"
      :currency="currency"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import MarketcapsCoingecko from './MarketcapsCoingecko'

export default {
  components: { MarketcapsCoingecko },
  setup() {
    const currency = ref('krw')

    const currencies = ref(['krw', 'usd'].map(key => ({ key })))

    return {
      currency,
      currencies,
    }
  },
}
</script>

<style lang="scss">
.view-marketcaps {
  max-width: 992px;
  margin: auto;
  padding: var(--app-default-page-padding);

  .settings {
    display: flex;
    justify-content: space-between;

    .source,
    .currency {
      display: flex;
      align-items: center;
    }

    .source {
      a {
        text-decoration: underline;
        color: var(--brand-primary);
        display: flex;
        align-items: center;
        margin-left: 8px;

        &:hover {
          font-weight: 700;
        }

        img {
          width: 16px;
          border-radius: 50%;
          margin: 0 8px;
        }
      }
    }
  }

  .app-dropdown {
    text-transform: uppercase;
    white-space: nowrap;
  }

  .marketcaps-common {
    table {
      width: 100%;
      
      td,
      th {
        padding: 8px 0;

        &:first-child {
          text-align: left;
        }

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