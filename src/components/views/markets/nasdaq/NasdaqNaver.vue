<template>
  <div 
    v-if="$store.getters.nasdaq"
    class="nasdaq-naver f-mono">
    <table class="list">
      <thead>
        <tr>
          <th
            @click="sort(th.column)"
            :class="[
              th.column === payload.column ? payload.direction : '',
              th.column ? 'cursor-pointer' : ''
            ]"
            :key="th.title"
            v-for="th in [
              { column: '$$rank' },
              { column: 'symbolCode', title: 'STOCK' },
              { column: 'closePrice', title: 'PRICE' },
              { column: 'fluctuationsRatio', title: '24h %' },
              { column: 'marketValueFull', title: 'MARKETCAPS', $$hide: $store.getters.windowInnerWidth < 480 },
              { column: 'accumulatedTradingVolume', title: 'VOL_24_SHARE', $$hide: $store.getters.windowInnerWidth < 768 },
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
          @click="onClickStock(item)"
          class="marketcap"
          :key="idx"
          v-for="(item, idx) in displayedList">
          <td>
            <div class="rank">{{ item.$$rank }}</div>
          </td>
          <td class="ticker">
            <div class="symbol-code">
              <span>{{ item.symbolCode }}</span><i @click.stop="openModalTradingView(item)" class="fa fa-chart-line"/>
            </div>
            <div class="stock-name">{{ item.stockName }}</div>
          </td>
          <td class="price">
            <div class="open">{{ displayPrice(item.closePrice).price }}</div>
            <div v-if="item.overMarketPriceInfo" class="over-market">
              <div class="badge-pre">PRE</div>
              <div class="value">{{ displayPrice((item.overMarketPriceInfo || {}).overPrice).price }}</div>
            </div>
            <div
              v-else
              class="open-fluctuation"
              :class="$helpers.template.priceColor(item.compareToPreviousClosePrice)">
              {{ displayPrice(item.compareToPreviousClosePrice).price }}
            </div>
          </td>
          <td class="percent-change-24h" :class="$helpers.template.priceColor(item.fluctuationsRatio)">
            {{ item.fluctuationsRatio }}%
          </td>
          <td v-if="$store.getters.windowInnerWidth >= 480" class="market-cap">
            {{ displayPrice(item.marketValueFull).cap }}
          </td>
          <td v-if="$store.getters.windowInnerWidth >= 768" class="vol-24h">
            {{ displayPrice(item.accumulatedTradingVolume).cap }}주
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { onMounted, onServerPrefetch, ref, computed, onUnmounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import nasdaq100 from './nasdaq-100'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const payload = ref({
      column: null,
      direction: null,
    })

    const displayPrice = value => {
      const parsed = parseFloat((value || '').replace(/,/g, ''))
      if (!parsed) return '?'

      const p = plugins.$helpers.number.pretty
      const baseCurrency = 'usd'

      return {
        cap: p.cap({ cap: parsed, baseCurrency }),
        price: p.price({ price: parsed, baseCurrency, fracs: store.getters.settings.currency === 'krw' ? 0 : 2 }),
        parsed,
      }
    }

    const sort = column => {
      if (!column) return

      if (column === payload.value.column) {
        payload.value.direction = payload.value.direction === 'desc' ? 'asc' : 'desc'
      } else {
        payload.value.column = column
        payload.value.direction = 'desc'
      }
    }

    const rawSortColumns = ['symbolCode', '$$rank']

    const displayedList = computed(() => {
      const arr = []
      store.getters.nasdaq.forEach(row => arr.push(row))
      arr.sort((a, b) => {
        let val1 = a[payload.value.column]
        let val2 = b[payload.value.column]
        const A = rawSortColumns.indexOf(payload.value.column) >= 0 ? val1 : displayPrice(val1).parsed
        const B = rawSortColumns.indexOf(payload.value.column) >= 0 ? val2 : displayPrice(val2).parsed
        if (payload.value.direction === 'asc') return A < B ? -1 : 1

        if (payload.value.direction === 'desc') return A < B ? 1 : -1
      })

      return arr
    })

    const interv = ref(null)

    const openModalTradingView = item => {
      console.log(item)
      plugins.$modal.custom({
        component: 'ModalTradingView',
        options: {
          symbol: `NASDAQ:${item.symbolCode}`,
          resizable: !store.getters.isMobile,
          noBackdrop: true,
          useMultiOpen: true,
        },
      })
    }

    const onClickStock = item => {
      window.open(`https://m.stock.naver.com/worldstock/stock/${item.reutersCode}/total`, '_blank')
    }

    const callApi = async () => {
      store.dispatch('loadNasdaq', nasdaq100)

      if (store.getters.isSSR) return

      clearInterval(interv.value)
      interv.value = setInterval(() => store.dispatch('loadNasdaq', nasdaq100), 1000 * 10)
    }

    onMounted(callApi)

    onUnmounted(() => {
      if (store.getters.isSSR) return

      clearInterval(interv.value)
    })

    onServerPrefetch(() => store.dispatch('loadNasdaq', nasdaq100))

    return {
      payload,
      sort,
      displayedList,
      onClickStock,
      displayPrice,
      openModalTradingView,
    }
  },
}
</script>

<style lang="scss" scoped>
.nasdaq-naver {
  table {
    width: 100%;

    td,
    th {
      padding: 4px;
      text-align: right;

      &:nth-child(2) {
        text-align: left;
      }

      @media (max-width: 767px) {
        font-size: 12px;
      }
    }

    .price {
      color: var(--text-stress);
      white-space: nowrap;
    }

    .over-market {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .badge-pre {
        margin-right: 8px;
        font-size: 10px;
        background: var(--border-base);
        padding: 0 4px;
        border-radius: 8px;
        white-space: nowrap;
      }

      .value {
        font-size: 12px;
      }
    }

    .ticker {
      .symbol-code {
        span {
          color: var(--brand-primary);
        }

        i {
          margin-left: 8px;
          transition: none;

          &:hover {
            color: var(--price-up);
          }
        }
      }

      .stock-name {
        font-size: 12px;
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