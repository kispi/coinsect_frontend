<template>
  <div class="modal-add-portfolio">
    <ModalHeader :title="$translate('ADD_PORTFOLIO')" @close="$emit('close')"/>
    <div class="p-16">
      <div class="form-control">
        <label>거래소</label>
        <AppDropdown :dropdownItems="exchanges" @select-dropdown-item="onSelect"/>
      </div>
      <div class="form-control">
        <label>마켓</label>
        <input v-model="payload.market" placeholder="EX:) KRW-BTC">
      </div>
      <div class="form-control">
        <label>보유수량</label>
        <input v-model="payload.amount" placeholder="EX:) 0.1">
      </div>
      <div class="form-control">
        <label>매수평균단가 (KRW)</label>
        <input v-model="payload.averagePurchasePrice" placeholder="EX:) 52000000">
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
          :disabled="!payload.averagePurchasePrice || !payload.amount || !payload.market"
          v-html="$translate('CONFIRM')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  setup(_, { emit }) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const exchanges = ref([{ key: 'upbit' }, { key: 'binance' }])

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
    input {
      padding: 8px;
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