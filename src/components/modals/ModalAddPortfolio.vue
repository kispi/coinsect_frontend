<template>
  <div class="modal-add-portfolio">
    <ModalHeader :title="helpers.translate('ADD_PORTFOLIO')" @close="$emit('close')"/>
    <div class="p-16">
      <div class="form-control">
        <label>거래소</label>
        <AppDropdown :dropdownItems="exchanges" @select-dropdown-item="onSelectExchange"/>
      </div>
      <div class="form-control">
        <label>마켓</label>
        <AppDropdown :dropdownItems="sortedMarkets" @select-dropdown-item="onSelectMarket"/>
      </div>
      <div class="form-control">
        <label>보유수량</label>
        <input
          v-model="payload.amount"
          placeholder="EX:) 1"
          @keydown.enter="addPortfolioItem">
      </div>
      <div class="form-control">
        <label>매수평균단가 ({{ payload.exchange === 'upbit' ? 'KRW' : 'USD' }})</label>
        <input
          v-model="payload.averagePurchasePrice"
          :placeholder="`EX:) ${payload.exchange === 'upbit' ? 52000000 : 42000}`"
          @keydown.enter="addPortfolioItem">
      </div>
    </div>
    <div
      class="buttons">
      <div class="flex-row">
        <button
          @click="$emit('close')"
          class="btn btn-default"
          v-html="helpers.translate('CANCEL')"
        />
        <button
          @click="addPortfolioItem"
          class="btn btn-primary"
          :disabled="disabled"
          v-html="helpers.translate('CONFIRM')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

const emit = defineEmits(['close'])

const { helpers, store } = useGlobalHooks()

const exchanges = ref([])

const sortedMarkets = ref([])

const disabled = computed(() => !payload.value.averagePurchasePrice || !payload.value.amount)

const populateMarkets = () => {
  const x = payload.value.exchange
  sortedMarkets.value = JSON.parse(JSON.stringify(store.getters.markets[x].map(o => x === 'upbit' ? o.market : o)))
    .sort((a, b) => a > b ? 1 : -1).map(key => ({ key }))
}

const payload = ref({
  averagePurchasePrice: null,
  amount: null,
  market: null,
  exchange: 'upbit',
})

const onSelectExchange = o => {
  exchanges.value.forEach(x => {
    x.$$selected = x.key === o.key
    if (x.$$selected) payload.value.exchange = x.key
  })
}

const onSelectMarket = o => {
  sortedMarkets.value.forEach(x => {
    x.$$selected = x.key === o.key
    if (x.$$selected) payload.value.market = x.key
  })
}

const addPortfolioItem = () => {
  if (disabled.value) return

  const portfolio = store.getters.settings.portfolio
  let found, errMsg
  if (payload.value.exchange === 'upbit') {
    found = store.getters.markets.upbit.find(o => o.market === payload.value.market)
    if (!found) errMsg = `마켓 '${payload.value.market}'는 업비트에 존재하지 않습니다`
  }

  if (payload.value.exchange === 'binance') {
    found = store.getters.markets.binance.find(market => market === payload.value.market)
    payload.value.averagePurchasePrice *= store.getters.usdKrw
    if (!found) errMsg = `마켓 '${payload.value.market}'는 바이낸스에 존재하지 않습니다`
  }

  if (errMsg) {
    helpers.toast.error(errMsg)
    return
  }

  if (!payload.value.averagePurchasePrice) {
    helpers.toast.error('매수평균단가를 입력하세요')
    return
  }

  if (!payload.value.amount) {
    helpers.toast.error('보유수량을 입력하세요')
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

watch(
  () => payload.value.exchange,
  populateMarkets,
)

onMounted(() => {
  exchanges.value = ['upbit', 'binance'].map(key => ({ key, img: require(`@/assets/images/${key}.svg`) }))
  populateMarkets()
})
</script>

<style lang="scss" scoped>
.modal-add-portfolio {
  border-radius: 4px;
  width: 480px;

  .form-control {
    label {
      color: var(--text-stress);
      font-weight: 700;
    }

    select {
      width: 100%;
      padding: 8px;
      color: red;
    }

    input {
      padding: 8px;
      text-transform: uppercase;

      &::placeholder {
        color: var(--gs-88);
      }
    }

    &:not(:last-child) {
      margin-bottom: 16px;
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