<template>
  <div 
    v-if="$store.getters.marketcaps"
    class="marketcaps-coingecko">
    <table class="list">
      <thead>
        <tr>
          <th
            @click="sort(th.column)"
            :class="[
              th.column === payload.sort.column ? payload.sort.direction : '',
              th.column ? 'cursor-pointer' : ''
            ]"
            :key="th.title"
            v-for="th in [
              { column: 'id', title: 'COIN' },
              { column: 'volume', title: 'VOL_24' },
              { title: 'PRICE', $$hide: $store.getters.isMobile },
              { title: 'CIRCULATING_SUPPLY', $$hide: $store.getters.isMobile },
              { column: 'market_cap', title: 'MARKETCAPS' },
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
          v-for="(item, idx) in $store.getters.marketcaps">
          <td class="ticker">
            <div class="rank">{{ item.market_cap_rank || '?' }}</div>
            <img
              :src="item.image"
              @error="e => e.target.src = 'https://cryprice.com/cryptocurrency-icons-master/svg/color/generic.svg'"
            >
            <div
              class="symbol lines-1"
              v-html="(item.symbol || '').toUpperCase()"
            />
            <div
              class="full-name lines-1"
              v-html="($store.getters.symbols[(item.symbol || '').toUpperCase()] || {})[$store.getters.translation.locale]"
            />
          </td>
          <td class="vol-24">
            {{ $helpers.number.pretty.cap({ cap: item.total_volume, baseCurrency: 'usd' }) || '?' }}
          </td>
          <td v-if="!$store.getters.isMobile" class="price">
            {{ $helpers.number.pretty.price({ price: item.current_price, baseCurrency: 'usd' }) || '?' }}
          </td>
          <td v-if="!$store.getters.isMobile" class="circulating">
            {{ item.circulating_supply ? item.circulating_supply.toLocaleString() : '?' }}
          </td>
          <td class="marketcaps">
            {{ $helpers.number.pretty.cap({ cap: item.market_cap, baseCurrency: 'usd' }) }}
          </td>
        </tr>
      </tbody>
    </table>
    <AppPagination
      class="m-t-16"
      v-if="total"
      :page="payload.page"
      :limit="payload.perPage"
      :total="total"
      @page="onPage"
    />
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const total = ref(null)

    const payload = ref({
      // category: '',
      perPage: 100,
      page: 1,
      priceChangePercentage: '1h,24h,7d,14d,30d',
      sort: {
        column: 'market_cap',
        direction: 'desc',
      },
    })

    const sort = column => {
      if (!column) return

      if (column === payload.value.sort.column) {
        payload.value.sort.direction = payload.value.sort.direction === 'desc' ? 'asc' : 'desc'
      } else {
        payload.value.sort.column = column
        payload.value.sort.direction = 'desc'
      }

      callApi()
    }

    const callApi = async page => {
      await store.dispatch('loadMarketcaps', {
        ...payload.value,
        page,
      })
    }

    const onPage = async page => {
      if (payload.value.page === page) return

      callApi(page).then(() => payload.value.page = page)
    }

    onMounted(() => {
      callApi()
      plugins.$http.get('https://api.coingecko.com/api/v3/coins/list').then(data => total.value = data.length)
    })

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
.marketcaps-coingecko {
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
      }

      .full-name {
        color: var(--text-stress);
        font-weight: 700;
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
</style>