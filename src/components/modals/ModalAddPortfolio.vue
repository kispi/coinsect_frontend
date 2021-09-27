<template>
  <div class="modal-add-portfolio">
    <ModalHeader :title="$translate('ADD_PORTFOLIO')" @close="$emit('close')"/>
    <div class="p-16">
      <div class="form-control">
        <label>거래소</label>
        <AppDropdown :dropdownItems="exchanges" @select-dropdown-item="onSelect"/>
      </div>
      <div class="form-control">
        <label>심볼</label>
        <select v-model="payload.market">
          <option
            :key="x"
            v-for="x in sortedMarkets"
            v-html="x"
          />
        </select>
      </div>
      <div class="form-control">
        <label>보유수량</label>
        <input v-model="payload.amount" placeholder="EX:) 1">
      </div>
      <div class="form-control">
        <label>매수평균단가 ({{ payload.exchange === 'upbit' ? 'KRW' : 'USD' }})</label>
        <input v-model="payload.averagePurchasePrice" :placeholder="`EX:) ${payload.exchange === 'upbit' ? 52000000 : 42000}`">
      </div>
    </div>
    <div
      class="buttons">
      <div class="flex-row">
        <button
          @click="$emit('close')"
          class="btn btn-default"
          v-html="$translate('CANCEL')"
        />
        <button
          @click="addPortfolioItem"
          class="btn btn-primary"
          :disabled="!payload.averagePurchasePrice || !payload.amount"
          v-html="$translate('CONFIRM')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  setup(_, { emit }) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const exchanges = ref(['upbit', 'binance'].map(key => ({ key, img: require(`@/assets/images/${key}.svg`) })))

    const sortedMarkets = computed(() => {
      const x = payload.value.exchange
      const filtered = JSON.parse(JSON.stringify(store.getters.markets[x].map(o => x === 'upbit' ? o.market : o)))
      return filtered.sort((a, b) => a > b ? 1 : -1)
    })

    const payload = ref({
      averagePurchasePrice: null,
      amount: null,
      market: null,
      exchange: 'upbit',
    })

    const onSelect = o => {
      exchanges.value.forEach(x => {
        x.$$selected = x.key === o.key
        if (x.$$selected) payload.value.exchange = x.key
      })
    }

    const addPortfolioItem = () => {
      const portfolio = store.getters.settings.portfolio
      let found, errMsg
      if (payload.value.exchange === 'upbit') {
        found = store.getters.markets.upbit.find(o => o.market === payload.value.market)
        if (!found) errMsg = `페어 'KRW-${s}'는 업비트에 존재하지 않습니다`
      }

      if (payload.value.exchange === 'binance') {
        found = store.getters.markets.binance.find(market => market === payload.value.market)
        payload.value.averagePurchasePrice *= store.getters.usdKrw
        if (!found) errMsg = `페어 '${s}USDT'는 바이낸스에 존재하지 않습니다`
      }

      if (errMsg) {
        plugins.$toast.error(errMsg)
        return
      }

      if (!payload.value.averagePurchasePrice) {
        plugins.$toast.error('매수평균단가를 입력하세요')
        return
      }

      if (!payload.value.amount) {
        plugins.$toast.error('보유수량을 입력하세요')
        return
      }

      payload.value.market = payload.value.market.toUpperCase()
      if (!portfolio[payload.value.exchange]) portfolio[payload.value.exchange] = []
      const idx = portfolio[payload.value.exchange].findIndex(o => o.market === payload.value.market)
      if (idx >= 0) portfolio[payload.value.exchange][idx] = payload.value
      else portfolio[payload.value.exchange].push(payload.value)

      store.commit('setSettings', { portfolio })
      emit('close')
    }

    return {
      exchanges,
      sortedMarkets,
      payload,
      onSelect,
      addPortfolioItem,
    }
  },
}
</script>

<style lang="scss" scoped>
.modal-add-portfolio {
  border-radius: 4px;
  width: 480px;

  .form-control {
    label {
      color: var(--text-stress);
      font-weight: 600;
    }

    select {
      width: 100%;
      padding: 8px;
    }

    input {
      padding: 8px;
      text-transform: uppercase;

      &::placeholder {
        color: var(--gs-88);
      }
    }
  }

  .buttons {
    margin: 16px auto;
    display: table;

    button {
      padding: 12px 40px;

      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}
</style>