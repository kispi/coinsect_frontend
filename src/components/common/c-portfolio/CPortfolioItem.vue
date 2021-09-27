<template>
  <div class="c-portfolio-item">
    <div
      @click="removePortfolioItem"
      class="remove-portfolio center">
      <i class="fal fa-times"/>
    </div>
    <div
      class="market"
      @click="openModalInput({
        type: 'amount',
        exchange,
        market: item.market,
        initial: item.amount,
      })">
      <div class="key">항목</div>
      <div class="value">{{ (parseFloat(item.amount) || 0).toFixed(8) }} / {{ item.market }}</div>
    </div>
    <div
      class="average-purchase-price"
      @click="openModalInput({
        type: 'averagePurchasePrice',
        exchange,
        market: item.market,
        initial: item.averagePurchasePrice,
      })">
      <div class="key">매수평균</div>
      <div class="value">{{ displayedPrice(item.averagePurchasePrice, exchange) }}</div>
    </div>
    <div class="current-worth">
      <div class="key">평가금액</div>
      <div class="value">{{ displayedPrice(item.$$worth, exchange) }}</div>
    </div>
    <div
      class="roi"
      :class="{
        'c-price-up': item.$$unrealized > 0,
        'c-price-down': item.$$unrealized < 0,
      }">
      <div class="key">평가손익</div>
      <div class="value">{{ displayedPrice(item.$$unrealized, exchange) }} ({{ item.$$roi.toFixed(2) }}%)</div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue'
import { useStore } from 'vuex'

export default {
  props: ['item', 'exchange'],
  setup(props) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const removePortfolioItem = () => {
      const portfolio = store.getters.settings.portfolio
      const idx = (portfolio[props.exchange] || []).findIndex(o => o.market === props.item.market)
      if (idx >= 0) portfolio[props.exchange].splice(idx, 1)

      if ((portfolio[props.exchange] || []).length === 0) delete portfolio[props.exchange]
      store.commit('setSettings', { portfolio })
    }

    const displayedPrice = (price, exchange) => plugins.$helpers.number.pretty.price({ price, baseCurrency: ['upbit', 'bithumb'].includes(exchange) ? 'krw' : 'usd' })

    const openModalInput = ({ type, exchange, market, initial }) => {
      const portfolio = store.getters.settings.portfolio

      if (type === 'amount') {
        plugins.$modal.input({ title: '보유수량을 입력하세요', inputValue: initial })
          .then(amount => {
            if (!amount) return

            const idx = (portfolio[exchange] || []).findIndex(o => o.market === market)
            if (idx >= 0) {
              const rounded = Math.round(amount * Math.pow(10, 8)) / Math.pow(10, 8)
              portfolio[exchange][idx].amount = rounded
              store.commit('setSettings', { portfolio })
            }
          })
          return
      }

      if (type === 'averagePurchasePrice') {
        plugins.$modal.input({ title: '매수평균단가를 입력하세요', inputValue: initial })
          .then(avg => {
            if (!avg) return

            const idx = (portfolio[exchange] || []).findIndex(o => o.market === market) 
            if (idx >= 0) {
              portfolio[exchange][idx].averagePurchasePrice = Math.round(avg)
              store.commit('setSettings', { portfolio })
            }
          })
          return
      }
    }

    return {
      openModalInput,
      displayedPrice,
      removePortfolioItem,
    }
  },
}
</script>

<style lang="scss" scoped>
.c-portfolio-item {
  color: var(--text-stress);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
  border: 1px solid var(--border-light);
  padding: 8px;
  border-radius: 4px;
  line-height: 18px;
  position: relative;

  .remove-portfolio {
    cursor: pointer;
    font-size: 20px;
    width: 24px;
    height: 24px;
    position: absolute;
    right: 0;
    top: 0;
    color: var(--text-stress);
    background: var(--background-light);
  }

  .market,
  .average-purchase-price {
    cursor: pointer;

    &:hover {
      .value {
        text-decoration: underline;
      }
    }
  }

  .key {
    font-weight: 700;
    margin-bottom: 4px;
  }
}
</style>