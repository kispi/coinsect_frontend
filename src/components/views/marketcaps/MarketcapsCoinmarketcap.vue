<template>
  <div 
    v-if="($store.getters.marketcaps || {}).coinmarketcap"
    class="marketcaps-coinmarketcap">
    <table class="list">
      <thead>
        <tr>
          <th>{{ $translate('COIN') }}</th>
          <th>{{ $translate('VOL_24') }}</th>
          <th v-if="!$store.getters.isMobile">{{ $translate('PRICE') }}</th>
          <th v-if="!$store.getters.isMobile">{{ $translate('CIRCULATING_SUPPLY') }}</th>
          <th>{{ $translate('MARKETCAPS') }}</th>
        </tr>
      </thead>
      <tr
        class="marketcap"
        :key="idx"
        v-for="(item, idx) in $store.getters.marketcaps.coinmarketcap">
        <td class="ticker">
          <div class="rank">{{ idx + 1 }}</div>
          <img
            :src="`https://cryprice.com/cryptocurrency-icons-master/svg/color/${(item.symbol || '').toLowerCase()}.svg`"
            @error="e => e.target.src = 'https://cryprice.com/cryptocurrency-icons-master/svg/color/generic.svg'"
          >
          <div
            class="symbol"
            v-html="item.symbol"
          />
          <div
            class="full-name lines-1"
            v-html="item.name"
          />
        </td>
        <td class="vol-24">
          {{ $helpers.template.koreanizedNumber({ number: applyCurrency(item.quote.USD.volume_24h, true), useBigPicture: $store.getters.isMobile }) }}
        </td>
        <td v-if="!$store.getters.isMobile" class="price">
          {{ currency === 'usd' ? applyCurrency(item.quote.USD.price) : (Math.floor(item.quote.USD.price * $store.getters.usdKrw)).toLocaleString() }}
        </td>
        <td v-if="!$store.getters.isMobile" class="circulating">
          {{ item.circulating_supply.toLocaleString() }}
        </td>
        <td class="marketcaps">
          {{ $helpers.template.koreanizedNumber({ number: applyCurrency(item.quote.USD.market_cap, true), useBigPicture: $store.getters.isMobile }) }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    currency: String,
  },
  setup(props) {
    const store = useStore()

    const applyCurrency = (price, noFrac) => {
      if (props.currency === 'usd') {
        const converted = price
        if (noFrac) return Math.round(converted)

        let numFrags = 2
        if (converted < 1) numFrags = 4
        if (converted < 0.0001) numFrags = 8

        return converted.toLocaleString(
          undefined, {
            maximumFractionDigits: numFrags,
            minimumFractionDigits: numFrags,
          })
      }

      return price * store.getters.usdKrw
    }

    const callApi = () => {
      store.dispatch('loadMarketcaps', 'coinmarketcap')
    }

    onMounted(callApi)

    return {
      applyCurrency,
    }
  },
}
</script>

<style lang="scss" scoped>
.marketcaps-coinmarketcap {
  .list {
    border-collapse: collapse;
    width: 100%;
    
    td,
    th {
      min-width: 0;
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
      &:nth-child(even) {
        background: var(--almost-white);
      }

      &:hover {
        background: var(--brand-primary-bg-lv1);
      }
    }
  }
}
</style>