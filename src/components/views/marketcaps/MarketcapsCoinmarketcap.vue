<template>
  <div 
    v-if="($store.getters.marketcaps || {}).coinmarketcap"
    class="marketcaps-coinmarketcap">
    <table class="list">
      <thead>
        <tr>
          <th
            @click="setSort(th.column)"
            :class="sort.column === th.column ? sort.direction : ''"
            :key="th.title"
            v-for="th in [
              { column: '$$name', title: 'COIN' },
              { column: '$$volume24H', title: 'VOL_24' },
              { column: '$$price', title: 'PRICE', $$hide: $store.getters.isMobile },
              { column: '$$circulatingSupply', title: 'CIRCULATING_SUPPLY', $$hide: $store.getters.isMobile },
              { column: '$$marketCap', title: 'MARKETCAPS' },
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
              :src="`https://cryprice.com/cryptocurrency-icons-master/svg/color/${(item.$$symbol || '').toLowerCase()}.svg`"
              @error="e => e.target.src = 'https://cryprice.com/cryptocurrency-icons-master/svg/color/generic.svg'"
            >
            <div
              class="symbol"
              v-html="item.$$symbol"
            />
            <div
              class="full-name lines-1"
              v-html="item.$$name"
            />
          </td>
          <td class="vol-24">
            {{ $helpers.template.koreanizedNumber({ number: applyCurrency(item.$$volume24H, true) }) }}
          </td>
          <td v-if="!$store.getters.isMobile" class="price">
            {{ currency === 'usd' ? applyCurrency(item.quote.USD.price) : (Math.floor(item.$$price * $store.getters.usdKrw)).toLocaleString() }}
          </td>
          <td v-if="!$store.getters.isMobile" class="circulating">
            {{ item.$$circulatingSupply.toLocaleString() }}
          </td>
          <td class="marketcaps">
            {{ $helpers.template.koreanizedNumber({ number: applyCurrency(item.$$marketCap, true) }) }}
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

    const sort = ref({
      column: '$$marketCap', // '$$name', '$$volume24H', '$$price', '$$circulatingSupply', '$$marketCap'
      direction: 'desc',
    })

    const setSort = column => {
      if (sort.value.column === column) {
        sort.value.direction = sort.value.direction === 'desc' ? 'asc' : 'desc'
      } else {
        sort.value.column = column
        sort.value.direction = 'desc'
      }
    }

    const displayedList = computed(() => store.getters.marketcaps.coinmarketcap.sort((a, b) => {
      const former = sort.value.direction === 'asc' ? a : b
      const latter = sort.value.direction === 'asc' ? b : a
      if (sort.value.column === '$$name') return former.$$name > latter.$$name ? 1 : -1

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
      store.dispatch('loadMarketcaps', 'coinmarketcap')
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