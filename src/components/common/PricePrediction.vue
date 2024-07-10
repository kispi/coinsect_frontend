<template>
  <div
    class="price-prediction"
    :class="$helpers.logic.pricePrediction.outlook(pricePrediction)">
    <div class="flex-row items-center g-8">
      <div class="badge-ticker flex-wrap">
        <img v-if="mustThumb" :src="mustThumb"/>
        {{ o.ticker }}
      </div>
      <div class="outlook flex-wrap">{{ $helpers.logic.pricePrediction.outlook(pricePrediction) }}</div>
      <div
        ref="refSnapshot"
        class="snapshot flex-wrap"
        @mouseover="$tooltip.show({
          id: 'tooltipPredictionSnapshot',
          showAbove: refSnapshot,
          text: 'TOOLTIP_PREDICTION_SNAPSHOT',
        })"
        @mouseleave="$tooltip.hide('tooltipPredictionSnapshot')">
        <div>{{ $helpers.dayjs(o.createdAt).format('YYYY-MM-DD HH:mm') }}</div>
        <div class="small-vr">|</div>
        <div>${{ o.priceSnapshot }}</div>
      </div>
    </div>
    <div class="flex-row items-end">
      <ul class="p-l-16">
        <li class="disc">{{ $helpers.logic.pricePrediction.priceRange(pricePrediction) }} <span class="percentage">({{ summary.price }})</span></li>
        <li class="disc">{{ $helpers.logic.pricePrediction.dateRange(pricePrediction) }}</li>
        <li class="disc" v-html="$helpers.logic.pricePrediction.summary(pricePrediction)"/>
      </ul>
      <div class="profile flex-row items-center flex-wrap">
        <AppChatProfile v-if="o.user" :user="o.user"/>
        <div v-else class="flex-row items-center">
          <AppImg :src="require('@/assets/images/no-image-person.png')"/>
          <div class="c-text-stress">{{ o.nickname }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  props: {
    pricePrediction: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { plugins, store } = useGlobalHooks()

    const refSnapshot = ref(null)

    const mustThumb = computed(() => (store.getters.symbols[(props.pricePrediction.ticker || '').split('USDT')[0]] || {}).thumb)

    const summary = computed(() => {
      const p = props.pricePrediction
      const d = plugins.$helpers.dayjs
      const whatPriceToUse = (() => {
        if (plugins.$helpers.logic.pricePrediction.outlook(p) === 'bullish') return p.priceMax || p.priceMin
        if (plugins.$helpers.logic.pricePrediction.outlook(p) === 'bearish') return p.priceMin || p.priceMax
        return p.priceMin || p.priceMax
      })()
      const whatDayToUse = p.timeTo || p.timeFrom
      const diff = d(whatDayToUse).startOf('day').diff(d().startOf('day'), 'days')
      return {
        price: plugins.$helpers.logic.pricePrediction.outlook(p) !== 'sideways' ? `${((whatPriceToUse - p.priceSnapshot) * 100 / p.priceSnapshot).toFixed(2)}%` : '횡보',
        date: diff >= 0 ? `${diff}일 남음` : '만료',
      }
    })

    const p = price => plugins.$helpers.number.pretty.price({ price, noConversion: true })

    const o = computed(() => ({
      priceSnapshot: p(props.pricePrediction.priceSnapshot),
      priceMin: p(props.pricePrediction.priceMin),
      priceMax: p(props.pricePrediction.priceMax),
      ticker: props.pricePrediction.ticker,
      user: props.pricePrediction.user,
      nickname: props.pricePrediction.nickname,
      timeFrom: props.pricePrediction.timeFrom,
      timeTo: props.pricePrediction.timeTo,
      createdAt: props.pricePrediction.createdAt,
    }))

    return {
      refSnapshot,
      o,
      summary,
      mustThumb,
    }
  },
}
</script>

<style lang="scss">
.price-prediction {
  font-size: 12px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .app-img {
    width: 20px !important;
    height: 20px !important;
    border: 1px solid var(--border-base);
    border-radius: 50%;
    margin-right: 4px;
  }

  .snapshot {
    display: flex;
    align-items: center;
    opacity: 0.5;
    margin-left: auto;
  }

  .outlook {
    border-radius: 4px;
    font-size: 11px;
    display: table;
    padding: 0 4px;
    text-transform: capitalize;
    margin-right: auto;
    border: 1px solid var(--border-base);
  }

  .badge-ticker {
    display: flex;
    align-items: center;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.24);
    border: 1px solid var(--border-light);
    border-radius: 16px;
    padding: 0 6px;
    white-space: nowrap;

    img {
      width: 12px;
      height: 12px;
      margin-right: 4px;
    }
  }

  .small-vr {
    font-size: 10px;
    color: var(--border-base);
    margin: 0 4px;
  }

  &.bearish {
    background: var(--price-down-bybit-bg);

    .outlook {
      background: var(--price-down-bybit-bg);
      color: var(--price-down-bybit);
      border: 1px solid var(--price-down-bybit-bg);
    }

    .percentage {
      color: var(--price-down-bybit);
    }
  }

  &.bullish {
    background: var(--price-up-bybit-bg);

    .outlook {
      background: var(--price-up-bybit-bg);
      color: var(--price-up-bybit);
      border: 1px solid var(--price-up-bybit-bg);
    }

    .percentage {
      color: var(--price-up-bybit);
    }
  }
}
</style>