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
              th.column === payload.by ? payload.type : '',
              th.column ? 'cursor-pointer' : ''
            ]"
            :key="th.title"
            v-for="th in [
              { column: 'rank' },
              { column: 'name', title: 'STOCK' },
              { column: 'price', title: 'PRICE' },
              { column: 'percent_change_24h', title: '24h %', $$hide: $store.getters.windowInnerWidth < 480 },
              { column: 'market_cap', title: 'MARKETCAPS', $$hide: $store.getters.windowInnerWidth < 768 },
              { column: 'volume_24h', title: 'VOL_24_SHARE' },
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
          v-for="(item, idx) in $store.getters.nasdaq">
          <td>
            <div class="rank">{{ idx + 1 }}</div>
          </td>
          <td class="ticker">
            <div class="symbol-code">
              <span>{{ item.symbolCode }}</span><i @click.stop="openModalTradingView(item)" class="fa fa-chart-line"/>
            </div>
            <div class="stock-name">{{ item.stockName }}</div>
          </td>
          <td class="price">
            <div class="open">{{ display(item.closePrice).price }}</div>
            <div v-if="item.overMarketPriceInfo" class="pre">{{ display((item.overMarketPriceInfo || {}).overPrice).price }}</div>
            <div
              v-else
              class="open-fluctuation"
              :class="$helpers.template.priceColor(item.compareToPreviousClosePrice)">
              {{ item.compareToPreviousClosePrice }}
            </div>
          </td>
          <td class="percent-change-24h" :class="$helpers.template.priceColor(item.fluctuationsRatio)">
            {{ item.fluctuationsRatio }}%
          </td>
          <td v-if="$store.getters.windowInnerWidth >= 480" class="market-cap">
            {{ display(item.marketValueFull).cap }}
          </td>
          <td v-if="$store.getters.windowInnerWidth >= 768" class="vol-24h">
            {{ display(item.accumulatedTradingVolume).cap }}주
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
      by: null,
      type: null,
    })

    const display = value => {
      const parsed = parseFloat((value || '').replace(/,/g, ''))
      if (!parsed) return '?'

      const p = plugins.$helpers.number.pretty
      const baseCurrency = 'usd'

      return {
        cap: p.cap({ cap: parsed, baseCurrency }),
        price: p.price({ price: parsed, baseCurrency, fracs: 2 }),
      }
    }

    const sort = column => {
      if (!column) return

      if (column === payload.value.by) {
        payload.value.type = payload.value.type === 'desc' ? 'asc' : 'desc'
      } else {
        payload.value.by = column
        payload.value.type = 'desc'
      }
    }

    const interv = ref(null)

    const openModalTradingView = item => {
      console.log(item)
      plugins.$modal.custom({
        component: 'ModalTradingView',
        options: {
          symbol: `NASDAQ:${item.symbolCode}`,
          resizable: !store.getters.isMobile,
          noBackdrop: true,
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
      onClickStock,
      display,
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