<template>
  <div 
    v-if="($store.getters.marketcaps || {}).upbit"
    class="marketcaps-upbit">
    <table class="list">
      <thead>
        <tr>
          <th>{{ $translate('COIN') }}</th>
          <th>{{ $translate('VOL_24') }}</th>
          <th>{{ $translate('PRICE') }}</th>
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
            class="full-name"
            v-html="item[$store.getters.translation.locale === 'en' ? 'englishName' : 'koreanName']"
          />
        </td>
        <td class="vol-24">
          {{ $helpers.template.pricify(item.accTradePrice24h, 'krw') }}
        </td>
        <td class="price">
          {{ $helpers.template.pricify(item.price, 'krw') }}
        </td>
        <td class="marketcaps">
          {{ $helpers.template.pricify(item.marketCap, 'krw') }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    onMounted(() => {
      store.dispatch('loadMarketcaps', 'upbit')
    })
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
      padding: 8px;
    }

    .ticker {
      display: flex;
      align-items: center;
      white-space: nowrap;

      .rank {
        width: 32px;
      }

      img,
      .symbol {
        margin-right: 8px;
      }

      img {
        width: 16px;
      }

      .full-name {
        color: var(--gray-light);
      }
    }

    tr {
      border-bottom: 1px solid var(--gray-border);

      &:hover {
        background: var(--almost-white);
      }
    }
  }
}
</style>