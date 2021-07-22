<template>
  <div 
    v-if="$store.getters.marketcaps"
    class="marketcaps-coingecko">
    <table class="list">
      <thead>
        <tr>
          <th
            @click="setSort(th.column)"
            :class="sort.column === th.column ? sort.direction : ''"
            :key="th.title"
            v-for="th in [
              { column: 'name', title: 'COIN' },
              { column: 'total_volume', title: 'VOL_24' },
              { column: 'current_price', title: 'PRICE', $$hide: $store.getters.isMobile },
              { column: 'circulating_supply', title: 'CIRCULATING_SUPPLY', $$hide: $store.getters.isMobile },
              { column: 'market_cap', title: 'MARKETCAPS' },
            ].filter(o => !o.$$hide)">
            {{ $translate(th.title) }}
            <span class="sort-icons">
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
          v-for="(item, idx) in displayedList">
          <td class="ticker">
            <div class="rank">{{ idx + 1 }}</div>
            <img
              :src="item.image"
              @error="e => e.target.src = 'https://cryprice.com/cryptocurrency-icons-master/svg/color/generic.svg'"
            >
            <div
              class="symbol"
              v-html="(item.symbol || '').toUpperCase()"
            />
            <div
              class="full-name lines-1"
              v-html="($store.getters.symbols[(item.symbol || '').toUpperCase()] || {})[$store.getters.translation.locale]"
            />
          </td>
          <td class="vol-24">
            {{ $helpers.template.koreanizedNumber({ number: applyCurrency(item.total_volume, true) }) }}
          </td>
          <td v-if="!$store.getters.isMobile" class="price">
            {{ currency === 'usd' ? applyCurrency(item.current_price) : (Math.floor(item.current_price * $store.getters.usdKrw)).toLocaleString() }}
          </td>
          <td v-if="!$store.getters.isMobile" class="circulating">
            {{ item.circulating_supply.toLocaleString() }}
          </td>
          <td class="marketcaps">
            {{ $helpers.template.koreanizedNumber({ number: applyCurrency(item.market_cap, true) }) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    currency: String,
  },
  setup(props) {
    const store = useStore()

    console.log(store.getters.symbols)

    const sort = ref({
      column: 'market_cap',
      direction: 'desc',
    })

    const payload = ref({
      // category: '',
      perPage: 100,
      page: 1,
      priceChangePercentage: '1h,24h,7d,14d,30d',
    })

    const setSort = column => {
      if (sort.value.column === column) {
        sort.value.direction = sort.value.direction === 'desc' ? 'asc' : 'desc'
      } else {
        sort.value.column = column
        sort.value.direction = 'desc'
      }
    }

    const displayedList = computed(() => store.getters.marketcaps.sort((a, b) => {
      const former = sort.value.direction === 'asc' ? a : b
      const latter = sort.value.direction === 'asc' ? b : a
      if (sort.value.column === 'name') return former.name > latter.name ? 1 : -1

      return former[sort.value.column] - latter[sort.value.column]
    }))

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
      store.dispatch('loadMarketcaps', payload.value)
    }

    onMounted(callApi)

    return {
      sort,
      displayedList,
      setSort,
      applyCurrency,
    }
  },
}
</script>