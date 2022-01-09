<template>
  <div class="view-public-treasury">
    <AppLoading :loading="loading"/>
    <div class="description">
      비트코인을 보유한 공개된(상장) 회사들의 목록.<br>
      갈수록 많은 회사들이 dollar-devalution으로 인한 구매력 저하를 막기 위해 자사의 재무재표에 비트코인을 일정비율 추가할 것으로 예상된다.
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
      <div class="summary">
        <div class="total-holding">총 코인수: <i class="fab fa-btc"/>{{ data.total_holdings }}</div>
        <div class="total-current-value-usd">총 평가액: {{ $helpers.number.pretty.cap({ cap: data.total_value_usd, baseCurrency: 'usd' })}}</div>
        <div class="market-cap-dominance">시총 비중: {{ data.market_cap_dominance }}%</div>
      </div>
      <div class="list">
        <div
          class="item"
          :class="{
            'in-profit': company.total_current_value_usd > company.total_entry_value_usd,
            'in-loss': company.total_current_value_usd < company.total_entry_value_usd,
          }"
          :key="company.name"
          v-for="(company, idx) in data.companies">
          <div class="company-name">{{ idx + 1}}. [{{ company.country }}] {{ company.name }} ({{ company.symbol }})</div>
          <div class="company-holdings"><i class="fab fa-btc"/>{{ company.total_holdings.toLocaleString() }}</div>
          <div v-if="company.total_entry_value_usd" class="company-entry">매수금액: {{ $helpers.number.pretty.cap({ cap: company.total_entry_value_usd, baseCurrency: 'usd' }) }}</div>
          <div v-if="company.total_entry_value_usd" class="company-avg">평단: {{ $helpers.number.pretty.price({ price: company.$$avg_price, baseCurrency: 'usd' }) }}</div>
          <div class="company-current-value">평가액: {{ $helpers.number.pretty.cap({ cap: company.total_current_value_usd, baseCurrency: 'usd' }) }}</div>
          <div class="company-dominance">시총 비중: {{ company.percentage_of_total_supply }}%</div>
          <div v-if="company.$$profit" class="company-profit">수익률: {{ company.$$profit }}%</div>
        </div>
      </div>
    </template>
    <PoweredBy :by="'coingecko'"/>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, ref } from 'vue'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const loading = ref(null)

    const data = ref(null)

    const callApi = async () => {
      try {
        loading.value = true
        data.value = await plugins.$http.get('https://api.coingecko.com/api/v3/companies/public_treasury/bitcoin')
        data.value.companies.forEach(company => {
          if (company.total_entry_value_usd) {
            company.$$avg_price = Math.round(company.total_entry_value_usd / company.total_holdings)
            company.$$profit = Math.round(10000 * (company.total_current_value_usd - company.total_entry_value_usd) / company.total_entry_value_usd) / 100
          }
        })
      } catch (e) {
        plugins.$toast.error('정보를 가져올 수 없습니다')
      } finally {
        loading.value = false
      }
    }

    onMounted(callApi)

    return {
      data,
      loading,
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
    line-height: 18px;
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

  .summary {
    margin-top: 24px;
    font-weight: 500;
  }

  .list {
    margin: 24px 0;
    display: grid;
    grid-gap: 24px;

    .item {
      border-radius: 4px;
      box-shadow: 0 2px 4px var(--border-base);
      padding: 8px;

      .company-name {
        font-size: 18px;
        font-weight: 700;
      }

      .company-holdings {
        display: flex;
        align-items: center;
        margin: 8px 0;
        padding: 2px 8px;
        border: 1px solid var(--bitcoin);
        display: table;
        border-radius: 16px;
        font-weight: 700;
      }

      .company-profit {
        font-weight: 500;
      }
    }

    .in-profit .company-profit {
      color: var(--price-up-bybit);
    }

    .in-loss .company-profit {
      color: var(--price-down-bybit);
    }

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>