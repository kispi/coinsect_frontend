<template>
  <div class="modal-create-price-prediction">
    <ModalHeader :title="$translate('CREATE_PREDICTION')" @close="$emit('close')"/>
    <div class="body pre-line">
      <div class="form-control">
        <label>{{ $translate('MARKET') }}</label>
        <AppDropdown
          :dropdownItems="tickerList"
          @select-dropdown-item="onClickTicker"
        />
        <div class="m-t-8 f-12">{{ $translate('CURRENT_PRICE') }}: ${{ $helpers.number.pretty.price({ price: currentTickerPrice, noConversion: true }) || '-' }}</div>
      </div>
      <div class="form-control">
        <label>{{ $translate('PERIOD') }} (시작일만 필수)</label>
        <AdaptiveLayout
          :gap="8"
          :boundaryWidth="480"
          :class="{'items-center': !$store.getters.isMobile}">
          <AppDatePicker
            v-model="payload.timeFrom"
            :locale="$store.getters.settings.locale"
            :enable-time-picker="false"
            :dark="$store.getters.settings.theme === 'dark'"
            :min-date="$helpers.dayjs().startOf('day').format('YYYY-MM-DD')"
          />
          <div v-if="!$store.getters.isMobile" class="flex-wrap">-</div>
          <AppDatePicker
            v-model="payload.timeTo"
            :locale="$store.getters.settings.locale"
            :enable-time-picker="false"
            :dark="$store.getters.settings.theme === 'dark'"
            :min-date="payload.timeFrom"
          />
        </AdaptiveLayout>
      </div>
      <div class="form-control">
        <label>{{ $translate('PRICE_RANGE') }} (둘 중 하나는 필수)</label>
        <div class="flex-row items-center">
          <div class="input-wrapper">
            <span>$</span>
            <input v-model="payload.priceMin" type="number" :placeholder="placeholder.min"/>
          </div>
          <div class="m-l-8 m-r-8 flex-wrap">-</div>
          <div class="input-wrapper">
            <span>$</span>
            <input v-model="payload.priceMax" type="number" :placeholder="placeholder.max"/>
          </div>
        </div>
      </div>
      <div class="text-center f-12 m-t-8" v-html="$translate('PRICE_PREDICTION_DESCRIPTION')"/>
      <button
        class="btn btn-primary"
        @click="createPrediction">
        {{ $translate('SUBMIT') }}
      </button>
    </div>
  </div>
</template>

<script>
import { computed, onUnmounted, ref, watch } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'
import crudService from '@/services/crud'

export default {
  props: ['options'],
  setup(props, { emit }) {
    const { plugins, store } = useGlobalHooks()

    const timeout = ref(null)

    const currentTickerPrice = ref(null)

    const payload = ref({
      ticker: 'BTCUSDT',
      timeFrom: plugins.$helpers.dayjs().add(1, 'days').startOf('day').format('YYYY-MM-DD'),
      timeTo: null,
      priceMin: null,
      priceMax: null,
      password: null,
    })

    const placeholder = computed(() => {
      const stringified = parseFloat(currentTickerPrice.value || 0).toFixed(2)
      return {
        min: plugins.$helpers.number.pretty.price({ price: parseFloat(stringified) - parseFloat(stringified) * 0.1, noConversion: true }),
        max: plugins.$helpers.number.pretty.price({ price: parseFloat(stringified) + parseFloat(stringified) * 0.1, noConversion: true }),
      }
    })

    const populateTickerPrice = async () => {
      try {
        const data = await plugins.$http.get('https://api.bybit.com/v5/market/tickers', {
          params: {
            category: 'linear',
            symbol: payload.value.ticker,
          },
        })
        currentTickerPrice.value = data.result.list[0].lastPrice
      } catch (e) {}
      timeout.value = setTimeout(populateTickerPrice, 1000 * 10)
    }

    const onClickTicker = async ticker => {
      clearTimeout(timeout.value)

      payload.value.ticker = ticker.key
      populateTickerPrice()
    }

    const sorts = ['BTC', 'ETH', 'XRP', 'BNB', 'SOL', 'ADA', 'DOGE', 'TRX', 'LINK', 'AVAX', 'MATIC', 'DOT', 'LTC', 'BCH'].map(key => `${key}USDT`)

    const tickerList = computed(() => {
      return store.getters.markets.bybit.map(key => {
        const symbol = (key || '').split('USDT')[0]
        return {
          $$selected: payload.value.ticker === key,
          key,
          img: (store.getters.symbols[symbol] || {}).thumb,
        }
      }).sort((a, b) => {
        // BITCOIN FIRST AND THEN ETHEREUM AND THEN LITECOIN
        const aIndex = sorts.indexOf(a.key)
        const bIndex = sorts.indexOf(b.key)
        if (aIndex > -1 && bIndex > -1) return aIndex - bIndex
        if (aIndex > -1 && bIndex === -1) return -1
        if (aIndex === -1 && bIndex > -1) return 1

        // THEN SORT BY TICKERS HAVING IMAGE
        if (a.img && !b.img) return -1
      })
    })

    const valid = () => {
      if (!payload.value.priceMax && !payload.value.priceMin) {
        plugins.$toast.error('가격 구간 최솟값이나 최댓값, 적어도 둘 중 하나는 있어야 합니다.')
        return false
      }

      if (!payload.value.timeFrom && !payload.value.timeTo) {
        plugins.$toast.error('시간 구간 최솟값이나 최댓값, 적어도 둘 중 하나는 있어야 합니다.')
        return false
      }

      if (payload.value.timeFrom && !plugins.$helpers.dayjs(payload.value.timeFrom).isValid()) {
        plugins.$toast.error('시작일이 올바르지 않습니다.')
        return false
      }

      if (payload.value.timeTo && !plugins.$helpers.dayjs(payload.value.timeTo).isValid()) {
        plugins.$toast.error('종료일이 올바르지 않습니다.')
        return false
      }

      return true
    }

    const createPrediction = async () => {
      if (!valid()) return

      const isToday = plugins.$helpers.dayjs(payload.value.timeFrom).isSame(plugins.$helpers.dayjs(), 'day')
      if (isToday) {
        const ok = await plugins.$modal.confirm({
          body: plugins.$translate('MODAL_WARNING_CREATE_PREDICTION_TODAY').replace('%s', plugins.$helpers.logic.pricePrediction.priceRange(payload.value)),
        })
        if (!ok) return
      }

      try {
        if (store.getters.me) delete payload.value.password
        await crudService.pricePrediction.create({
          ...payload.value,
          nickname: store.getters.me ? store.getters.me.profile.nickname : ((plugins.$helpers.localStorage.getMeta('user') || {}).profile || {}).nickname,
        })
        store.dispatch('loadPricePredictions')
        emit('close')
      } catch (e) {
        plugins.$toast.error(e.data.message)
      }
    }

    watch(
      () => payload.value.timeFrom,
      newVal => {
        payload.value.timeFrom = plugins.$helpers.dayjs(newVal).startOf('day').format('YYYY-MM-DD')
        if (payload.value.timeFrom > payload.value.timeTo) payload.value.timeTo = plugins.$helpers.dayjs(newVal).endOf('day').format('YYYY-MM-DD')
      },
    )

    watch(
      () => payload.value.timeTo,
      newVal => {
        payload.value.timeTo = plugins.$helpers.dayjs(newVal).endOf('day').format('YYYY-MM-DD')
      },
    )

    onUnmounted(() => {
      if (timeout.value) clearTimeout(timeout.value)
    })

    return {
      tickerList,
      payload,
      currentTickerPrice,
      placeholder,
      onClickTicker,
      createPrediction,
    }
  },
}
</script>

<style lang="scss" scoped>
.modal-create-price-prediction {
  border-radius: 4px;
  width: 480px;
  overflow: visible;

  .body {
    padding: 16px;
    overflow: visible;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .btn-primary {
    padding: 12px 16px;
  }

  .input-wrapper {
    display: flex;
    padding: 8px;

    span {
      margin-right: 8px;
    }
  }
}
</style>