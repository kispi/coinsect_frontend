<template>
  <div 
    v-if="($store.getters.marketcaps || {}).upbit"
    class="marketcaps-upbit">
    <table class="list">
      <thead>
        <tr>
          <th>{{ $translate('COIN') }}</th>
          <th>{{ $translate('VOL_24') }}</th>
          <th v-if="!$store.getters.isMobile">{{ $translate('PRICE') }}</th>
          <th>{{ $translate('MARKETCAPS') }}</th>
        </tr>
      </thead>
      <tr
        class="marketcap"
        :key="idx"
        v-for="(item, idx) in $store.getters.marketcaps.upbit">
        <td class="ticker">
          <div class="rank">{{ idx + 1 }}</div>
          <img :src="`https://static.upbit.com/logos/${item.symbol}.png`">
          <div
            class="symbol"
            v-html="item.symbol"
          />
          <div
            class="full-name lines-1"
            v-html="item[$store.getters.translation.locale === 'en' ? 'englishName' : 'koreanName']"
          />
        </td>
        <td class="vol-24">
          {{ $helpers.template.koreanizedNumber({ number: applyCurrency(item.accTradePrice24h, true), useBigPicture: $store.getters.isMobile }) }}
        </td>
        <td v-if="!$store.getters.isMobile" class="price">
          {{ currency === 'usd' ? applyCurrency(item.price) : $helpers.template.prettyPrice({ price: item.price }) }}
        </td>
        <td class="marketcaps">
          {{ $helpers.template.koreanizedNumber({ number: applyCurrency(item.marketCap, true), useBigPicture: $store.getters.isMobile }) }}
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
        const converted = price / store.getters.usdKrw
        if (noFrac) return Math.round(converted)

        let numFracs = 2
        if (converted < 1) numFracs = 4
        if (converted < 0.0001) numFracs = 8

        return converted.toLocaleString(
          undefined, {
            maximumFractionDigits: numFracs,
            minimumFractionDigits: numFracs,
          })
      }

      return price
    }

    const callApi = () => {
      store.dispatch('loadMarketcaps', 'upbit')
    }

    onMounted(callApi)

    return {
      applyCurrency,
    }
  },
}
</script>

<style lang="scss" scoped>
.marketcaps-upbit {
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