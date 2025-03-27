<template>
  <div 
    v-if="$store.getters.kospi"
    class="kospi-naver">
    <table class="list table-stock">
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
              { column: 'accumulatedTradingVolume', title: 'VOL_24', $$hide: $store.getters.windowInnerWidth < 768 },
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
          :class="[
            ((item.compareToPreviousPrice || {}).name || '').toLowerCase(),
          ]"
          :key="idx"
          v-for="(item, idx) in displayedList">
          <td>
            <div class="rank">{{ item.$$rank }}</div>
          </td>
          <td class="ticker">
            <div class="symbol-code">
              <span>{{ item.reutersCode }}</span><i @click.stop="openModalTradingView(item)" class="fa fa-chart-line"/>
            </div>
            <div class="stock-name">{{ item.stockName }}</div>
          </td>
          <td class="price">
            <div class="open">{{ displayPrice(item.closePrice).price }}</div>
            <div
              class="fluctuation"
              :class="$helpers.template.priceColor(item.compareToPreviousClosePrice)">
              {{ displayPrice(item.compareToPreviousClosePrice).price }}
            </div>
          </td>
          <td class="percent-change-24h" :class="$helpers.template.priceColor(item.fluctuationsRatio)">
            {{ item.fluctuationsRatio }}%
          </td>
          <td v-if="$store.getters.windowInnerWidth >= 480" class="market-cap">
            {{ displayPrice(item.marketValue).cap }}
          </td>
          <td v-if="$store.getters.windowInnerWidth >= 768" class="vol-24h">
            {{ displayPrice(item.accumulatedTradingValue).value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { onMounted, onServerPrefetch, ref, computed, onUnmounted } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { helpers, store } = useGlobalHooks()

    const payload = ref({
      column: null,
      direction: null,
    })

    const displayPrice = value => {
      const parsed = parseFloat((value || '').replace(/,/g, ''))
      if (!parsed) return '?'

      const p = helpers.number.pretty
      const baseCurrency = 'krw'

      return {
        cap: p.cap({ cap: parsed * Math.pow(10, 8), baseCurrency }),
        value: p.cap({ cap: parsed * Math.pow(10, 6), baseCurrency }),
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
      store.getters.kospi.forEach(row => arr.push(row))
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
      helpers.modal.custom({
        component: 'ModalTradingView',
        options: {
          symbol: `KRX:${item.reutersCode}`,
          resizable: !store.getters.isMobile,
          noBackdrop: true,
          useMultiOpen: true,
        },
      })
    }

    const onClickStock = item => {
      window.open(`https://m.stock.naver.com/domestic/stock/${item.reutersCode}/total`, '_blank')
    }

    const callApi = async () => {
      store.dispatch('loadKospi')

      if (store.getters.isSSR) return

      clearInterval(interv.value)
      interv.value = setInterval(() => store.dispatch('loadKospi'), 1000 * 10)
    }

    onMounted(callApi)

    onUnmounted(() => {
      if (store.getters.isSSR) return

      clearInterval(interv.value)
    })

    onServerPrefetch(() => store.dispatch('loadKospi'))

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