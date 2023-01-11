<template>
  <div class="view-public-treasury">
    <template v-if="data">
      <div
        class="list pretty-scrollbar"
        :key="key"
        v-for="key in Object.keys(data)">
        <div class="entity-category">{{ $translate(key) }}</div>
        <div class="table f-mono">
          <div class="thead">
            <div class="row">
              <div class="td">단체</div>
              <div class="td"><div>홀딩</div><div>시총비중</div></div>
              <div class="td"><div>매수금액</div><div>평가액</div></div>
              <div class="td" v-if="!$store.getters.isMobile"><div>평단</div><div>수익률</div></div>
            </div>
          </div>
          <div class="tbody">
            <div
              target="_blank"
              rel="noreferrer"
              class="row"
              :class="{
                'in-profit': entity.valuation > entity.costBasis,
                'in-loss': entity.valuation < entity.costBasis,
              }"
              :key="entity.name"
              v-for="entity in data[key]">
              <div class="td">{{ entity.name }} ({{ entity.symbol }})</div>
              <div class="td">
                <div><i class="fab fa-btc" v-if="entity.holdings"/>{{ entity.holdings ? entity.holdings.toLocaleString() : '-' }}</div>
                <div>{{ entity.dominance ? `${entity.dominance}%` : '-' }}</div>
              </div>
              <div class="td">
                <div>{{ entity.costBasis ? $helpers.number.pretty.cap({ cap: entity.costBasis, baseCurrency: 'usd' }) : '-' }}</div>
                <div>{{ entity.valuation ? $helpers.number.pretty.cap({ cap: entity.valuation, baseCurrency: 'usd' }) : '-' }}</div>
              </div>
              <div class="td" v-if="!$store.getters.isMobile">
                <div>{{ entity.profit ? $helpers.number.pretty.price({ price: entity.avgPrice, baseCurrency: 'usd' }) : '-' }}</div>
                <div class="profit">{{ entity.profit ? `${entity.profit}%` : '-' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <PoweredBy :by="'bitcointreasuries'" class="f-14"/>
  </div>
</template>

<script>
import { computed, onMounted, onServerPrefetch, onUnmounted } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { plugins, store } = useGlobalHooks()

    const data = computed(() => {
      if (!store.getters.publicTreasuries) return

      const group = {}
      store.getters.publicTreasuries.forEach(pt => group[pt.type] ? group[pt.type].push(pt) : group[pt.type] = [pt])
      Object.keys(group).forEach(key => {
        if (group[key].length === 0) delete group[key]
      })
      return group
    })

    const callApi = async () => {
      if (store.getters.publicTreasuries) return

      try {
        await store.dispatch('loadPublicTreasuries')
      } catch (e) {
        plugins.$toast.error('정보를 가져올 수 없습니다')
      }
    }

    onMounted(callApi)

    onUnmounted(() => store.commit('setPublicTreasuries', null))

    onServerPrefetch(() => store.dispatch('loadPublicTreasuries'))

    return {
      data,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-public-treasury {
  .fa-btc {
    color: var(--bitcoin);
    margin-right: 4px;
  }

  .list {
    margin: 24px 0;

    .entity-category {
      font-size: 14px;
      margin-bottom: 8px;
      padding: 4px 8px;
      background: var(--background-light);
      color: var(--text-stress);
      display: table;
      border-radius: 4px;
    }
  }

  .table {
    display: table;
    font-size: 12px;
    width: 100%;

    .thead {
      border-top: 1px solid var(--border-base);
    }

    .row {
      display: flex;
      color: var(--text-stress);
      border-bottom: 1px solid var(--border-base);

      &.cursor-pointer {
        &:hover {
          background: var(--background-light);
        }
      }

      .td {
        width: 80px;
        padding: 8px;
        flex: 0 0 auto;

        &:nth-child(1) {
          flex: 1 1 0;
        }

        &:nth-child(2),
        &:nth-child(3),
        &:nth-child(4) {
          width: 104px;
          text-align: right;
        }

        > div:not(:last-child) {
          margin-bottom: 4px;
        }
      }

      a {
        display: block;
      }
    }
  }

  .in-profit .profit {
    color: var(--price-up);
  }

  .in-loss .profit {
    color: var(--price-down);
  }

  @media (min-width: 768px) {
    .table {
      font-size: 14px;

      .row {
        .td {
          width: 160px;
          flex: 0 0 auto;

          &:nth-child(2),
          &:nth-child(3),
          &:nth-child(4) {
            width: 160px;
          }
        }
      }
    }
  }
}
</style>