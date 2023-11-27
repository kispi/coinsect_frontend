<template>
  <div
    class="price-prediction"
    :class="o.$$outlook()">
    <div class="profile">
      <AppChatProfile v-if="o.user" :user="o.user"/>
      <div v-else class="flex-row items-center">
        <AppImg :src="require('@/assets/images/no-image-person.png')"/>
        <div class="c-text-stress">{{ o.nickname }}</div>
      </div>
      <div
        ref="refSnapshot"
        class="snapshot"
        @mouseover="$tooltip.show({
          id: 'tooltipPredictionSnapshot',
          showAbove: refSnapshot,
          text: 'TOOLTIP_PREDICTION_SNAPSHOT',
        })"
        @mouseleave="$tooltip.hide('tooltipPredictionSnapshot')">
        <div class="value">{{ $helpers.dayjs(o.createdAt).format('YYYY-MM-DD HH:mm') }}</div>
        <div class="m-l-8 m-r-8">/</div>
        <div class="value">${{ o.priceSnapshot }}</div>
      </div>
      <div class="outlook">{{ o.$$outlook() }}</div>
    </div>
    <div class="prediction">
      <div class="value">{{ dateRange }}</div>
      <div class="m-l-8 m-r-8">/</div>
      <div class="value">{{ priceRange }}</div>
      <div class="m-l-8 m-r-8">/</div>
      <div class="badge-ticker">{{ o.ticker }}</div>
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
    const { plugins } = useGlobalHooks()

    const refSnapshot = ref(null)

    const d = date => plugins.$helpers.dayjs(date).format('YYYY-MM-DD')

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
      $$outlook: () => {
        if (props.pricePrediction.priceMin > props.pricePrediction.priceSnapshot) return 'long'
        if (props.pricePrediction.priceMax < props.pricePrediction.priceSnapshot) return 'short'
      },
    }))

    const dateRange = computed(() => {
      if (o.value.timeFrom && o.value.timeTo) return `${d(o.value.timeFrom)} ~ ${d(o.value.timeTo)}`
      if (o.value.timeFrom) return `${d(o.value.timeFrom)} ~`
      if (o.value.timeTo) return `~ ${d(o.value.timeTo)}`
    })

    const priceRange = computed(() => {
      if (o.value.priceMin && o.value.priceMax) return `$ ${o.value.priceMin} ~ $ ${o.value.priceMax}`
      if (o.value.priceMin) return `$ ${o.value.priceMin} ~`
      if (o.value.priceMax) return `~ $ ${o.value.priceMax}`
    })

    return {
      refSnapshot,
      o,
      dateRange,
      priceRange,
    }
  },
}
</script>

<style lang="scss" scoped>
.price-prediction {
  .profile {
    display: flex;
    align-items: center;
    gap: 8px;

    .app-img {
      width: 24px;
      height: 24px;
      border: 1px solid var(--border-base);
      border-radius: 50%;
      margin-right: 4px;
    }

    .snapshot {
      display: flex;
      align-items: center;
      opacity: 0.5;
      font-size: 12px;
    }

    .outlook {
      border-radius: 4px;
      font-size: 11px;
      display: table;
      padding: 0 4px;
      text-transform: capitalize;
      margin-right: auto;
    }
  }

  .prediction {
    display: flex;
    margin-top: 4px;
    padding-left: 16px;
    font-size: 12px;
    color: var(--text-stress);
  }

  &.short {
    .outlook {
      background: var(--price-down-bybit-bg);
      color: var(--price-down-bybit);
    }
  }

  &.long {
    .outlook {
      background: var(--price-up-bybit-bg);
      color: var(--price-up-bybit);
    }
  }
}
</style>