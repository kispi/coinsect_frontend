<template>
  <div class="salary-as-crypto">
    <div class="header">
      <div>내 연봉은 몇</div>
      <AppDropdown :dropdownItems="sortedMarkets" @select-dropdown-item="onSelectCrypto" class="m-l-8"/>?
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onUnmounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import useUpbit from '@/hooks/websockets/upbit'

export default {
  props: {
    salary: {
      type: Object,
      required: true,
    },
    modelValue: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const { subscribe } = useUpbit()

    const loading = ref(null)

    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const connection = ref(null)

    const sortedMarkets = ref([])

    const crypto = ref('BTC')

    const populateMarkets = () => {
      sortedMarkets.value = JSON.parse(JSON.stringify(store.getters.markets.upbit.map(o => o.market)))
        .sort((a, b) => a > b ? 1 : -1).map(market => ({ key: market.split('KRW-')[1] }))

      sortedMarkets.value.forEach(o => {
        o.img = store.getters.symbols[o.key].thumb
        o.$$selected = o.key === crypto.value
      })
    }

    const onSelectCrypto = market => crypto.value = market.key

    const init = async () => {
      try {
        await store.dispatch('loadBaseMarkets')
        populateMarkets()
        const conn = await subscribe({
          type: 'ticker',
          codes: store.getters.markets.upbit.map(o => o.market),
          $$raw: true,
        })
        connection.value = conn
      } catch (e) {
        plugins.$toast.error('문제가 발생했습니다 ㅜ.ㅜ 새로고침해주세요')
      }
    }

    onMounted(init)

    onUnmounted(() => {
      connection.value.close()
    })

    watch(
      () => (store.getters.rawWebsocketInfo.upbit || {})[`KRW-${crypto.value}`],
      newVal => {
        if (!newVal) return 0

        const result = {}
        result.$$symbol = crypto.value
        result.$$img = store.getters.symbols[crypto.value].thumb
        Object.keys(props.salary).forEach(key => result[`$$${key}`] = Math.round(10000 * props.salary[key] / newVal.tp) / 10000)
        emit('convert-as-crypto', result)
        return result
      },
    )

    return {
      loading,
      sortedMarkets,
      onSelectCrypto,
    }
  },
}
</script>

<style lang="scss">
.salary-as-crypto {
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 700;
    color: var(--text-stress);
    margin: 24px auto;

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
  }
}
</style>