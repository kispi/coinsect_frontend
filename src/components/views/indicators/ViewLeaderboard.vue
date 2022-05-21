<template>
  <div class="view-leaderboard">
    <div class="last-update">btctools와의 최종 동기화: {{ lastUpdate }}</div>
    <table>
      <thead>
        <tr>
          <th
            class="p-t-8 p-b-8"
            @click="setSort(th.column)"
            :class="sort.column === th.column ? sort.direction : ''"
            :key="th.title"
            v-for="th in [
              { column: 'rank', title: 'RANK' },
              { column: 'name', title: 'NAME' },
              { column: 'side', title: 'PREDICTED_POSITION' },
              { column: 'profit', title: 'PROFIT_TOTAL', $$hide: $store.getters.isMobile },
              { column: 'dailyChange', title: 'PROFIT_24H' },
              { column: 'weeklyChange', title: 'PROFIT_7D' },
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
          :key="row.name"
          v-for="row in sorted">
          <td>{{ row.rank }}</td>
          <td><div class="lines-1" v-html="row.name"/></td>
          <td :class="(row.side || '').toLowerCase()">{{ row.side }}</td>
          <td v-if="!$store.getters.isMobile" :class="{'long': row.profit > 0, 'short': row.profit < 0}"><i class="fab fa-btc"/>{{ asBTC(row.profit) }}</td>
          <td :class="{'long': row.dailyChange > 0, 'short': row.dailyChange < 0}"><i class="fab fa-btc"/>{{ asBTC(row.dailyChange) }}</td>
          <td :class="{'long': row.weeklyChange > 0, 'short': row.weeklyChange < 0}"><i class="fab fa-btc"/>{{ asBTC(row.weeklyChange) }}</td>
        </tr>
      </tbody>
    </table>
    <div class="description">
      <div class="m-b-8">출처: <a href="https://btctools.io/stats/leaderboard" target="_blank" rel="noopener" class="c-brand-primary">btctools.io</a></div>
      <div>위 트레이더들의 예측 포지션은 말 그대로 '예측' 포지션이며 <a class="c-danger text-underline f-700" href="https://gall.dcinside.com/mgallery/board/view/?id=electronicmoney&no=1372708" rel="noopener" target="_blank">실시간 포지션이 아닙니다.</a></div>
      <div>BitMEX 리더보드는 보통 하루 단위로 갱신된다고 알려져 있으며, btctools는 5분 단위로 그 정보를 긁어서 최신 상태를 유지합니다.</div>
      <div class="m-t-8">
        최종 업데이트 시점 기준으로 비트코인의 가격이 올랐는데 수익이 증가한 트레이더들은 <b class="long">Long</b>을,
        비트코인의 가격이 떨어졌는데 수익이 증가한 트레이더들은 <b class="short">Short</b> 포지션을 갖고 있었을 것으로 예상합니다.
        손실을 본 트레이더들은 위 기준으로 산정된 <b>'올바른'</b> 포지션의 반대 방향을 잡고 있었으리라 추측할 수 있습니다.
      </div>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, onMounted, onServerPrefetch, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const timeout = ref(null)

    const lastUpdate = ref(null)

    const store = useStore()

    const sort = ref({
      column: 'rank',
      direction: 'asc',
    })

    const asBTC = sats => {
      return ((sats || 0) / 100000000).toLocaleString(
        undefined, {
          maximumFractionDigits: 4,
          minimumFractionDigits: 4,
        },
      )
    }

    const setSort = column => {
      if (sort.value.column !== column) {
        sort.value.column = column
        sort.value.direction = 'desc'
        return
      }

      sort.value.direction = sort.value.direction === 'desc' ? 'asc' : 'desc'
    }

    const leaderboard = computed(() => store.getters.leaderboard)

    const sorted = computed(() => {
      if (!leaderboard.value) return []

      const copied = JSON.parse(JSON.stringify(leaderboard.value))
      return copied.sort((a, b) => {
        if (a[sort.value.column] === undefined) return 1

        if (b[sort.value.column] === undefined) return -1

        if (sort.value.direction === 'asc') return a[sort.value.column] < b[sort.value.column] ? -1 : 1

        if (sort.value.direction === 'desc') return a[sort.value.column] < b[sort.value.column] ? 1 : -1
      })
    })

    const loadLeaderboard = async () => {
      try {
        await store.dispatch('loadLeaderboard')
        let minute = plugins.$helpers.dayjs().format('mm')
        minute = `${plugins.$helpers.template.withLeadingZero(minute - minute % 5, 2 )}`
        lastUpdate.value = plugins.$helpers.dayjs().format('YYYY-MM-DD HH:') + minute
        timeout.value = setTimeout(loadLeaderboard, 1000 * 60)
      } catch (e) {}
    }

    onMounted(loadLeaderboard)

    onUnmounted(() => clearTimeout(timeout.value))

    onServerPrefetch(() => store.dispatch('loadLeaderboard'))

    return {
      lastUpdate,
      sort,
      sorted,
      setSort,
      asBTC,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-leaderboard {
  .last-update {
    color: var(--text-stress);
    margin-left: auto;
    display: table;
    font-size: 12px;
  }

  table {
    margin-top: 16px;
    width: 100%;

    @media (max-width: 767px) {
      font-size: 12px;

      .lines-1 {
        max-width: 80px;
      }
    }

    td,
    th {
      padding: 8px 0;
      text-align: center;
    }

    th {
      cursor: pointer;
    }

    td {
      i {
        margin-right: 4px;
      }
    }
  }

  .long {
    color: var(--price-up-bybit);
  }

  .short {
    color: var(--price-down-bybit);
  }

  .description {
    padding: 16px 0;
    font-size: 12px;
    line-height: 20px;
  }

  .fa-btc {
    color: var(--bitcoin);
  }
}
</style>