<template>
  <div 
    v-if="$store.getters.marketcaps"
    class="marketcaps-coinmarketcap">
    <div class="header">
      <div class="tag-slugs">
        <div
          @click="onClickTagSlug(tagSlug)"
          class="tag-slug"
          :class="{'selected': tagSlug.$$selected}"
          :key="tagSlug.key"
          v-for="tagSlug in tagSlugs"
          v-html="tagSlug.name"
        />
      </div>
      <div class="total">({{ $store.getters.marketcaps.total }})</div>
    </div>
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
              { column: 'rank' },
              { column: 'name', title: 'COIN' },
              { column: 'price', title: 'PRICE' },
              { column: 'percent_change_24h', title: '24h %', $$hide: $store.getters.windowInnerWidth < 480 },
              { column: 'percent_change_7d', title: '7d %', $$hide: $store.getters.windowInnerWidth < 480 },
              { column: 'market_cap', title: 'MARKETCAPS' },
              { column: 'circulating_supply', title: 'CIRCULATING_SUPPLY', $$hide: $store.getters.isMobile },
              { column: 'volume_24h', title: 'VOL_24', $$hide: $store.getters.isMobile },
            ].filter(o => !o.$$hide)">
            {{ $translate(th.title) }}
            <span
              v-if="th.column"
              class="sort-icons">
              <i class="fas fa-sort-up"/>
              <i class="fas fa-sort-down"/>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          @click="onClickCrypto(item)"
          class="marketcap"
          :key="idx"
          v-for="(item, idx) in $store.getters.marketcaps.data">
          <td>
            <div class="rank">{{ item.cmcRank }}</div>
          </td>
          <td class="ticker">
            <img
              :src="`https://s2.coinmarketcap.com/static/img/coins/64x64/${item.id}.png`"
              :alt="item.slug"
            >
            <span
              class="symbol lines-1"
              v-html="item.symbol.toUpperCase()"
            />
            <span
              class="full-name lines-1"
              v-html="item.slug"
            />
          </td>
          <td class="price">
            {{ $helpers.number.pretty.price({ price: item.quotes[1].price, baseCurrency: 'usd' }) || '?' }}
          </td>
          <td v-if="$store.getters.windowInnerWidth >= 480" class="percent-change-24h" :class="$helpers.template.priceColor(item.quotes[1].percentChange24h)">
            {{ $helpers.number.pretty.percent(item.quotes[1].percentChange24h) }}%
          </td>
          <td v-if="$store.getters.windowInnerWidth >= 480" class="percent-change-7d" :class="$helpers.template.priceColor(item.quotes[1].percentChange7d)">
            {{ $helpers.number.pretty.percent(item.quotes[1].percentChange7d) }}%
          </td>
          <td class="market-cap">
            {{ $helpers.number.pretty.cap({ cap: item.quotes[1].marketCap, baseCurrency: 'usd' }) }}
          </td>
          <td v-if="!$store.getters.isMobile" class="circulating">
            {{ item.circulatingSupply ? item.circulatingSupply.toLocaleString() : '?' }}
          </td>
          <td v-if="!$store.getters.isMobile" class="vol-24h">
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
import { onMounted, onServerPrefetch, ref, computed, onUnmounted } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const total = ref(null)

    const tagSlugs = computed(() => [
      { name: 'All', key: '' },
      { name: 'DeFi', key: 'defi' },
      { name: 'NFT', key: 'collectibles-nfts' },
      { name: 'Metaverse', key: 'metaverse' },
      { name: 'Polkadot', key: 'polkadot-ecosystem' },
      { name: 'BNB Chain', key: 'bnb-chain' },
      { name: 'Solana', key: 'solana-ecosystem' },
      { name: 'Avalanche', key: 'avalanche-ecosystem' },
    ].map(o => ({
      ...o,
      $$selected: o.key === payload.value.tagSlugs,
    })))

    const payload = ref({
      limit: 100,
      page: 1,
      sortBy: 'market_cap',
      sortType: 'desc',
      tagSlugs: '',
    })

    const onClickTagSlug = tagSlug => {
      payload.value.tagSlugs = tagSlug.key
      payload.value.page = 1
      callApi()
    }

    const sort = column => {
      if (!column) return

      if (column === payload.value.sortBy) {
        payload.value.sortType = payload.value.sortType === 'desc' ? 'asc' : 'desc'
      } else {
        payload.value.sortBy = column
        payload.value.sortType = 'desc'
      }
      callApi()
    }

    const interv = ref(null)

    const onClickCrypto = item => {
      window.open(`https://coinmarketcap.com/currencies/${item.slug}`, '_blank')
    }

    const callApi = async () => {
      store.dispatch('loadMarketcaps', payload.value)

      if (store.getters.isSSR) return

      clearInterval(interv.value)
      interv.value = setInterval(() => store.dispatch('loadMarketcaps', payload.value), 1000 * 60)
    }

    const onPage = async page => {
      if (payload.value.page === page) return

      payload.value.page = page
      callApi()
    }

    onMounted(callApi)

    onUnmounted(() => {
      if (store.getters.isSSR) return

      clearInterval(interv.value)
    })

    onServerPrefetch(() => store.dispatch('loadMarketcaps', payload.value))

    return {
      payload,
      total,
      onPage,
      sort,
      tagSlugs,
      onClickCrypto,
      onClickTagSlug,
    }
  },
}
</script>

<style lang="scss" scoped>
.marketcaps-coinmarketcap {
  font-family: Arial, Helvetica, sans-serif;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-top: 1px solid var(--border-base);

    .total {
      color: var(--text-stress);
      flex: 0 0 auto;
      margin-left: 16px;
    }
  }

  .tag-slugs {
    .tag-slug {
      display: inline-block;
      color: var(--text-stress);
      margin: 4px 8px;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }

      &.selected {
        color: var(--brand-primary);
      }
    }
  }

  table {
    width: 100%;
    
    td,
    th {
      padding: 8px 0;
      text-align: right;

      &:first-child {
        padding-right: 8px;
      }

      &:nth-child(2) {
        text-align: left;
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

    @media (max-width: 479px) {
      .vol-24h,
      .market-cap {
        letter-spacing: -0.8px;
      }
    }

    tr {
      cursor: pointer;

      &:hover {
        background: var(--background-light);
      }
    }
  }
}
</style>