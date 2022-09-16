<template>
  <div 
    v-if="$store.getters.assetsIncludingMetal"
    class="view-assets-including-metal f-mono">
    <table class="list">
      <thead>
        <tr>
          <th
            @click="sort(th.column)"
            :class="[
              th.column === payload.column ? payload.direction : '',
              th.column ? 'cursor-pointer' : '',
              th.column === 'code' ? 'text-left': '',
            ]"
            :key="th.title"
            v-for="th in [
              { column: 'rank', $$hide: $store.getters.windowInnerWidth < 480 },
              { column: 'code', title: 'STOCK' },
              { column: 'cap', title: 'MARKETCAPS' },
              { column: 'price', title: 'PRICE' },
              { column: 'dailyChange', title: '24h %' },
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
          <td v-if="$store.getters.windowInnerWidth >= 480">
            <div class="rank">{{ item.rank }}</div>
          </td>
          <td class="ticker text-left">
            <AppImg :src="item.logo" :alt="item.name"/>
            <div>
              <div class="code">
                <span>{{ item.code }}</span><i @click.stop="openModalTradingView(item)" class="fa fa-chart-line"/>
              </div>
              <div class="name">{{ item.name }}</div>
            </div>
          </td>
          <td class="market-cap">
            {{ displayPrice(item.cap).cap }}
          </td>
          <td class="price">{{ displayPrice(item.price).price }}</td>
          <td class="percent-change-24h" :class="$helpers.template.priceColor(item.dailyChange)">
            {{ item.dailyChange }}%
          </td>
        </tr>
      </tbody>
    </table>
    <PoweredBy :by="'companiesmarketcap'" :link="'https://companiesmarketcap.com/assets-by-market-cap'" class="m-t-24"/>
  </div>
</template>

<script>
import { onMounted, onUnmounted, onServerPrefetch, ref, computed, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const payload = ref({
      column: null,
      direction: null,
    })

    const displayPrice = value => {
      if (!value) return '?'

      const p = plugins.$helpers.number.pretty
      const baseCurrency = 'usd'

      return {
        cap: p.cap({ cap: value, baseCurrency }),
        price: p.price({ price: value, baseCurrency, fracs: store.getters.settings.currency === 'krw' ? 0 : 2 }),
        value,
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

    const rawSortColumns = ['code', 'rank']

    const displayedList = computed(() => {
      const arr = []
      store.getters.assetsIncludingMetal.forEach(row => arr.push(row))
      arr.sort((a, b) => {
        let val1 = a[payload.value.column]
        let val2 = b[payload.value.column]
        const A = rawSortColumns.indexOf(payload.value.column) >= 0 ? val1 : displayPrice(val1).value
        const B = rawSortColumns.indexOf(payload.value.column) >= 0 ? val2 : displayPrice(val2).value
        if (payload.value.direction === 'asc') return A < B ? -1 : 1

        if (payload.value.direction === 'desc') return A < B ? 1 : -1
      })

      return arr
    })

    const interv = ref(null)

    const openModalTradingView = item => {
      plugins.$modal.custom({
        component: 'ModalTradingView',
        options: {
          symbol: item.code,
          resizable: !store.getters.isMobile,
          noBackdrop: true,
          useMultiOpen: true,
        },
      })
    }

    const onClickStock = item => {
      window.open(`https://companiesmarketcap.com/${item.name.toLowerCase().replace(/ /g, '-')}/marketcap/`, '_blank')
    }

    const callApi = async () => {
      store.dispatch('loadAssetsIncludingMetal')

      if (store.getters.isSSR) return

      clearInterval(interv.value)
      interv.value = setInterval(() => store.dispatch('loadAssetsIncludingMetal'), 1000 * 60)
    }

    onMounted(() => {
      callApi()

      if (store.getters.isSSR) return

      store.commit('setSettings', { currency: 'usd' })
      plugins.$toast.success(`
        통화를 USD로 설정합니다. 페이지를 벗어나면 다시 원래 통화로 돌아갑니다.
        또는 상단 <i class='fa fa-cog'></i> 개인화 설정에서 언제든 변경하실 수 있습니다.
      `, 5000)
    })

    onUnmounted(() => {
      if (store.getters.isSSR) return

      clearInterval(interv.value)
      store.commit('setSettings', { currency: 'krw' })
    })

    onServerPrefetch(() => store.dispatch('loadAssetsIncludingMetal'))

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
.view-assets-including-metal {
  table {
    width: 100%;

    td,
    th {
      padding: 4px;

      &:not(.text-left) {
        text-align: right;
      }

      @media (max-width: 767px) {
        font-size: 12px;
      }
    }

    .price {
      color: var(--text-stress);
      white-space: nowrap;
    }

    .ticker {
      display: flex;
      align-items: center;

      .app-img {
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }

      .code {
        i {
          margin-left: 8px;
          transition: none;

          &:hover {
            color: var(--price-up);
          }
        }
      }

      .name {
        font-size: 12px;
      }
    }

    @media (max-width: 479px) {
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