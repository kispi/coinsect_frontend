<template>
  <div class="view-public-treasury">
    <AppLoading :loading="loading"/>
    <div class="description">
      국가 / 상장 회사들 / 비공개 기업 / 펀드 등 비트코인을 보유한 단체들의 목록.<br>
      갈수록 많은 단체들이 dollar-devalution으로 인한 구매력 저하를 막기 위해 자사의 재무재표에 비트코인을 일정비율 추가할 것이다.
    </div>
    <div class="region">
      <div class="flex-row">
        <div class="in-profit m-b-8"/>
        <div>수익중</div>
      </div>
      <div class="flex-row">
        <div class="in-loss"/>
        <div>손실중</div>
      </div>
    </div>
    <template v-if="data">
      <div class="list">
        <div
          class="item"
          :class="{
            'in-profit': entity.valuation > entity.costBasis,
            'in-loss': entity.valuation < entity.costBasis,
          }"
          :key="entity.name"
          v-for="(entity, idx) in data">
          <div class="entity-name">{{ idx + 1}}. [{{ entity.country }}] {{ entity.name }} ({{ entity.symbol }})</div>
          <div v-if="entity.holdings" class="entity-holdings"><i class="fab fa-btc"/>{{ entity.holdings.toLocaleString() }}</div>
          <div v-if="entity.costBasis" class="entity-entry">매수금액: {{ $helpers.number.pretty.cap({ cap: entity.costBasis, baseCurrency: 'usd' }) }}</div>
          <div v-if="entity.avgPrice" class="entity-avg">평단: {{ $helpers.number.pretty.price({ price: entity.avgPrice, baseCurrency: 'usd' }) }}</div>
          <div v-if="entity.valuation" class="entity-current-value">평가액: {{ $helpers.number.pretty.cap({ cap: entity.valuation, baseCurrency: 'usd' }) }}</div>
          <div v-if="entity.dominance" class="entity-dominance">시총 비중: {{ entity.dominance }}%</div>
          <div v-if="entity.profit" class="entity-profit">수익률: {{ entity.profit }}%</div>
          <a v-if="entity.source" class="entity-source m-t-8" :href="entity.source" target="_blank" rel="noreferrer">출처: <em class="text-underline">{{ entity.source }}</em></a>
        </div>
      </div>
    </template>
    <PoweredBy :by="'bitcointreasuries'"/>
  </div>
</template>

<script>
import { computed, getCurrentInstance, onMounted, onServerPrefetch, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const loading = ref(null)

    const data = computed(() => store.getters.publicTreasuries)

    const callApi = async () => {
      if (store.getters.publicTreasuries) return

      try {
        loading.value = true
        await store.dispatch('loadPublicTreasuries')
      } catch (e) {
        plugins.$toast.error('정보를 가져올 수 없습니다')
      } finally {
        loading.value = false
      }
    }

    onMounted(callApi)

    onServerPrefetch(() => store.dispatch('loadPublicTreasuries'))

    return {
      loading,
      data,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-public-treasury {
  font-size: 16px;
  line-height: 24px;
  color: var(--text-stress);

  .description {
    font-size: 14px;
    line-height: 22px;
  }

  .in-profit {
    background: rgba(36, 175, 100, 0.1);
  }

  .in-loss {
    background: rgba(240, 64, 64, 0.1);
  }

  .region {
    margin-top: 24px;
    font-size: 13px;
    border: 1px solid var(--border-base);
    padding: 12px;

    .in-profit,
    .in-loss {
      width: 24px;
      height: 24px;
      flex: 0 0 auto;
      margin-right: 8px;
    }
  }

  .fa-btc {
    margin-right: 8px;
    color: var(--bitcoin);
  }

  .list {
    margin: 24px 0;
    display: grid;
    grid-gap: 24px;

    .item {
      border-radius: 4px;
      box-shadow: 0 2px 4px var(--border-base);
      padding: 8px;

      .entity-name {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 8px;
      }

      .entity-holdings {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        padding: 2px 8px;
        border: 1px solid var(--bitcoin);
        display: table;
        border-radius: 16px;
        font-weight: 700;
      }

      .entity-profit {
        font-weight: 500;
      }

      .entity-source {
        font-size: 14px;
        display: block;
      }
    }

    .in-profit .entity-profit {
      color: var(--price-up-bybit);
    }

    .in-loss .entity-profit {
      color: var(--price-down-bybit);
    }

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>