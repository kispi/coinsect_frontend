<template>
  <div 
    v-if="($store.getters.marketcaps || {}).upbit"
    class="marketcaps-upbit">
    <table class="list">
      <thead>
        <tr>
          <th
            @click="setSort(th.column)"
            :class="sort.column === th.column ? sort.direction : ''"
            :key="th.title"
            v-for="th in [
              { column: 'symbol', title: 'COIN' },
              { column: 'accTradePrice24h', title: 'VOL_24' },
              { column: 'price', title: 'PRICE', $$hide: $store.getters.isMobile },
              { column: 'marketCap', title: 'MARKETCAPS' },
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
            <img :src="`https://static.upbit.com/logos/${item.symbol}.png`">
            <div
              class="symbol"
              v-html="item.symbol"
            />
            <div
              class="full-name lines-1"
              v-html="item[$store.getters.translation.locale === 'en' ? 'englishName' : 'koreanName']"
            />
          </td>
          <td class="vol-24">
            {{ $helpers.template.koreanizedNumber({ number: applyCurrency(item.accTradePrice24h, true) }) }}
          </td>
          <td v-if="!$store.getters.isMobile" class="price">
            {{ currency === 'usd' ? applyCurrency(item.price) : $helpers.template.prettyPrice({ price: item.price }) }}
          </td>
          <td class="marketcaps">
            {{ $helpers.template.koreanizedNumber({ number: applyCurrency(item.marketCap, true) }) }}
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
      column: 'marketCap', // 'symbol', 'accTradePrice24h', 'price', 'marketCap'
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

    const displayedList = computed(() => store.getters.marketcaps.upbit.sort((a, b) => {
      const former = sort.value.direction === 'asc' ? a : b
      const latter = sort.value.direction === 'asc' ? b : a
      if (sort.value.column === 'symbol') return former.symbol > latter.symbol ? 1 : -1

      return former[sort.value.column] - latter[sort.value.column]
    }))

    const applyCurrency = (price, noFrac) => {
      if (props.currency === 'usd') {
        const converted = price / store.getters.usdKrw
        if (noFrac) return Math.round(converted)

        let numFracs = 2
        if (converted < 1) numFracs = 4
        if (converted < 0.0001) numFracs = 8

        return converted.toLocaleString(
          undefined, {
            maximumFractionDigits: numFracs,
            minimumFractionDigits: numFracs,
          })
      }

      return price
    }

    const callApi = () => {
      store.dispatch('loadMarketcaps', 'upbit')
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