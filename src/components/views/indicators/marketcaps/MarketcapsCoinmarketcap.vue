<template>
  <div 
    v-if="$store.getters.marketcaps"
    class="marketcaps-coinmarketcap">
    <table class="list">
      <thead>
        <tr>
          <th
            @click="sort(th.column)"
            :class="[
              th.column === payload.sortBy ? payload.sortType : '',
              th.column ? 'cursor-pointer' : ''
            ]"
            :key="th.title"
            v-for="th in [
              { column: 'rank', title: 'COIN' },
              { column: 'price', title: 'PRICE', $$hide: $store.getters.isMobile },
              { title: '24h %', $$hide: $store.getters.isMobile },
              { title: '7d %', $$hide: $store.getters.isMobile },
              { title: 'MARKETCAPS' },
              { title: 'VOL_24' },
              { title: 'CIRCULATING_SUPPLY', $$hide: $store.getters.isMobile },
            ].filter(o => !o.$$hide)">
            {{ $translate(th.title) }}
            <span
              v-if="['id', 'volume', 'market_cap'].includes(th.column)"
              class="sort-icons">
              <i class="fas fa-sort-up"/>
              <i class="fas fa-sort-down"/>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="marketcap"
          :key="idx"
          v-for="(item, idx) in $store.getters.marketcaps.data">
          <td class="ticker">
            <div class="rank">{{ item.cmcRank }}</div>
            <img
              :src="`https://s2.coinmarketcap.com/static/img/coins/64x64/${item.id}.png`"
              alt="Default coin image"
            >
            <div
              class="symbol lines-1"
              v-html="item.symbol.toUpperCase()"
            />
            <div
              class="full-name lines-1 f-700"
              v-html="item.slug"
            />
          </td>
          <td v-if="!$store.getters.isMobile" class="price">
            {{ $helpers.number.pretty.price({ price: item.quotes[1].price, baseCurrency: 'usd' }) || '?' }}
          </td>
          <td v-if="!$store.getters.isMobile" class="percent-change-24h" :class="{'c-price-up': item.quotes[1].percentChange24h > 0, 'c-price-down': item.quotes[1].percentChange24h < 0}">
            {{ $helpers.number.pretty.percent(item.quotes[1].percentChange24h) }}%
          </td>
          <td v-if="!$store.getters.isMobile" class="percent-change-7d" :class="{'c-price-up': item.quotes[1].percentChange7d > 0, 'c-price-down': item.quotes[1].percentChange7d < 0}">
            {{ $helpers.number.pretty.percent(item.quotes[1].percentChange7d) }}%
          </td>
          <td class="marketcaps">
            {{ $helpers.number.pretty.cap({ cap: item.quotes[1].marketCap, baseCurrency: 'usd' }) }}
          </td>
          <td v-if="!$store.getters.isMobile" class="circulating">
            {{ item.circulatingSupply ? item.circulatingSupply.toLocaleString() : '?' }}
          </td>
          <td class="vol-24">
            {{ $helpers.number.pretty.cap({ cap: item.quotes[1].volume24h, baseCurrency: 'usd' }) || '?' }}
          </td>
        </tr>
      </tbody>
    </table>
    <AppPagination
      class="m-t-16"
      v-if="$store.getters.marketcaps.total"
      :page="payload.page"
      :limit="payload.limit"
      :total="$store.getters.marketcaps.total"
      @page="onPage"
    />
  </div>
</template>

<script>
import { onMounted, onServerPrefetch, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const total = ref(null)

    const payload = ref({
      limit: 100,
      page: 1,
      sortBy: 'market_cap',
      sortType: 'desc',
    })

    const sort = column => {
      if (!column) return

      if (column === payload.value.sortBy) {
        payload.value.sortType = payload.value.sortType === 'desc' ? 'asc' : 'desc'
      } else {
        payload.value.sortBy = column
        payload.value.sortType = 'desc'
      }

      runIntervalApiCall()
    }

    const interv = ref(null)

    const runIntervalApiCall = async () => {
      clearInterval(interv.value)
      interv.value = setInterval(() => store.dispatch('loadMarketcaps', payload.value), 1000 * 60)
    }

    const onPage = async page => {
      if (payload.value.page === page) return

      payload.value.page = page
      runIntervalApiCall()
    }

    onMounted(() => {
      store.dispatch('loadMarketcaps', payload.value)
    })

    onServerPrefetch(() => store.dispatch('loadMarketcaps', payload.value))

    return {
      payload,
      total,
      onPage,
      sort,
    }
  },
}
</script>

<style lang="scss" scoped>
.marketcaps-coinmarketcap {
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

    .full-name,
    .price {
      color: var(--text-stress);
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
      }

      .symbol,
      .full-name {
        max-width: 120px;

        @media (max-width: 767px) {
          max-width: 80px;
        }

        @media (max-width: 479px) {
          max-width: 48px;
        }
      }
    }

    @media (max-width: 479px) {
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
</style>