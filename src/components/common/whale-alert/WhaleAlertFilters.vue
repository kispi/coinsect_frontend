<template>
  <div class="whale-alert-filters">
    <div class="flex-row">
      <div class="form-control flex-fill m-r-16">
        <label>{{ helpers.translate('WA_AMOUNT_ABOVE') }}</label>
        <input v-model="params.amount" maxlength="20" type="number">
        <div v-if="params.amount > 0" class="pretty">{{ helpers.number.pretty.korean(params.amount) }} 코인</div>
      </div>
      <div class="form-control flex-fill">
        <label>{{ helpers.translate('WA_AMOUNT_USD_ABOVE') }}</label>
        <input v-model="params.amountUsd" maxlength="20" type="number">
        <div v-if="params.amountUsd > 0" class="pretty">$ {{ helpers.number.pretty.korean(params.amountUsd) }}</div>
      </div>
    </div>
    <div class="hr"/>
    <div class="form-control">
      <div class="filter-boolean" @click="params.excludeBetweenSameExchange = !params.excludeBetweenSameExchange">
        <AppCheckbox :modelValue="params.excludeBetweenSameExchange" class="no-touch"/>
        <div>{{ helpers.translate('WA_EXCLUDE_BETWEEN_SAME_EXCHANGE') }}</div>
      </div>
    </div>
    <div class="hr"/>
    <div class="form-control">
      <div class="flex-row flex-between items-center m-b-8" style="height: 24px;">
        <label class="m-b-0">{{ helpers.translate('WA_SYMBOLS') }}</label>
        <button
          v-if="params.symbols.filter(s => s.$$selected).length > 0"
          @click="deselectAll"
          class="btn btn-brd btn-small">
          {{ helpers.translate('WA_DESELECT_COIN_FILTERS') }}
        </button>
      </div>
      <div class="available-symbols">
        <div
          :key="aSymbol.symbol"
          v-for="aSymbol in availableSymbols"
          @click="onClickSymbol(aSymbol)"
          class="available-symbol"
          :class="{'selected': aSymbol.$$selected}">
          <AppImg :src="(store.getters.symbols[aSymbol.symbol.toUpperCase()] || {}).thumb"/>{{ aSymbol.symbol }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import constants from '@/assets/constants'
import useGlobalHooks from '@/hooks/global-hooks'

const emit = defineEmits(['change-params'])

const { helpers, store } = useGlobalHooks()

const availableSymbols = ref(
  ['btc', 'eth', 'usdt', 'usdc', 'busd', 'pax', 'gusd', 'bnb', 'xrp', 'xlm', 'wbtc', 'sand', 'trx', 'mana', 'matic', 'chz', 'paxg', 'bat', 'ankr', 'qnt', 'aave']
    .map(symbol => ({
      symbol,
      $$selected: false,
      isStable: constants.stableCoins.includes(symbol),
    }))
)

const params = ref({
  amount: 0,
  amountUsd: 3000000,
  symbols: availableSymbols.value,
  excludeBetweenSameExchange: true,
})

const onClickSymbol = symbol => {
  symbol.$$selected = !symbol.$$selected
  params.value.symbols = availableSymbols.value
}

const deselectAll =() => {
  params.value.symbols.forEach(s => s.$$selected = false)
}

watch(
  () => params.value,
  () => emit('change-params', params.value),
  { deep: true },
)

onMounted(() => emit('change-params', params.value))
</script>

<style lang="scss" scoped>
.whale-alert-filters {
  font-size: 12px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid var(--text-stress);

  .available-symbols {
    display: flex;
    flex-wrap: wrap;

    .available-symbol {
      display: flex;
      align-items: center;
      text-transform: uppercase;
      margin: 4px;
      cursor: pointer;

      .app-img {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }

      &.selected {
        text-decoration: underline;
        color: var(--brand-primary);
      }
    }
  }

  .hr {
    height: 1px;
    width: 100%;
    background: var(--border-base);
    margin: 16px 0;
  }

  .form-control {
    label {
      color: var(--text-stress);
    }

    .pretty {
      display: table;
      margin-top: 4px;
      margin-left: auto;
      font-size: 11px;
    }
  }

  .filter-boolean {
    display: flex;
    align-items: center;
    color: var(--text-stress);
    cursor: pointer;

    .app-checkbox {
      margin-right: 8px;
    }

    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
}
</style>