<template>
  <div class="salary-as-crypto">
    <div class="header">
      <div class="text">내 연봉은 몇</div>
      <AppDropdown
        :useSearch="true"
        :dropdownItems="sortedMarkets"
        :transparent="true"
        @select-dropdown-item="onSelectCrypto"
        class="m-l-8"
      />?
    </div>
    <div class="current-price f-mono">{{ helpers.number.pretty.price({ price: currentPriceAsKrw, baseCurrency: 'krw' }) }} {{ crypto }}/{{ store.getters.settings.currency }}</div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import useUpbit from '@/hooks/websockets/upbit'
import useGlobalHooks from '@/hooks/global-hooks'

const props = defineProps({
  salary: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['convert-as-crypto'])

const { subscribe } = useUpbit()

const { helpers, store } = useGlobalHooks()

const connection = ref(null)

const sortedMarkets = ref([])

const currentPriceAsKrw = ref(0)

const crypto = ref(store.getters.settings.salary.symbol)

const populateMarkets = () => {
  sortedMarkets.value = JSON.parse(JSON.stringify(store.getters.markets.upbit.map(o => o.market)))
    .sort((a, b) => (a > b ? 1 : -1)).map(market => ({ key: market.split('KRW-')[1] }))

  sortedMarkets.value.forEach(o => {
    o.img = (store.getters.symbols[o.key] || {}).thumb
    o.$$selected = o.key === crypto.value
  })
}

const onSelectCrypto = market => {
  if (!market) return

  crypto.value = market.key
  const stored = store.getters.settings.salary || {}
  stored.symbol = crypto.value
  store.commit('setSettings', { salary: stored })
}

const init = async () => {
  try {
    // 이 페이지에서는 기준이 krw로 강제되어야 함
    store.commit('setSettings', { baseExchangeMarket: 'krw' })
    await store.dispatch('loadBaseMarkets')
    const conn = await subscribe({
      type: 'ticker',
      codes: store.getters.markets.upbit.map(o => o.market),
      $$raw: true,
    })
    connection.value = conn
    populateMarkets()
  } catch (e) {
    helpers.toast.error('문제가 발생했습니다 😢 새로고침해주세요')
  }
}

onMounted(init)

onUnmounted(() => {
  if (connection.value) connection.value.close()
})

const updateReport = () => {
  const t = (store.getters.rawWebsocketInfo.upbit || {})[`KRW-${crypto.value}`]
  if (!t) return

  currentPriceAsKrw.value = t.tp

  const result = {}
  result.$$symbol = crypto.value
  result.$$img = (store.getters.symbols[crypto.value] || {}).thumb
  Object.keys(props.salary).forEach(key => result[`$$${key}`] = Math.round(10000 * props.salary[key] / t.tp) / 10000)
  emit('convert-as-crypto', result)
}

watch([
  () => (store.getters.rawWebsocketInfo.upbit || {})[`KRW-${crypto.value}`],
  () => props.salary,
],
  updateReport,
)

watch(
  () => store.getters.symbols,
  populateMarkets,
)
</script>

<style lang="scss">
.salary-as-crypto {
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-stress);
    margin: auto;

    .app-dropdown {
      white-space: nowrap;

      .clickable-area .key {
        text-decoration: underline;
      }

      &:hover .clickable-area .key {
        color: var(--brand-primary);
      }

      .chevrons {
        display: none;
      }
    }

    .text,
    .app-dropdown .clickable-area .key {
      font-size: 20px;
      font-weight: 700;
    }
  }

  .current-price {
    display: table;
    margin: 12px auto 24px;
    text-align: center;
    text-transform: uppercase;
  }
}
</style>