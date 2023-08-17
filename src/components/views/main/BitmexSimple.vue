<template>
  <div
    v-if="(leaderboards || []).length > 0"
    class="bitmex-simple">
    <div
      class="bitmex-position"
      :class="(position.side || '').toLowerCase()"
      :key="position.name"
      v-for="position in leaderboards">
      <div class="trader">
        <i class="fal" :class="{'fa-arrow-trend-up': position.side === 'Long', 'fa-arrow-trend-down': position.side === 'Short'}"/>
        {{ position.name }}
      </div>
      <div
        class="changes"
        :class="{'profit': position.dailyChange > 0, 'loss': position.dailyChange < 0}">
        Daily<div><span>{{ $helpers.template.asBTC(position.dailyChange) }} </span> BTC</div>
      </div>
      <div
        class="changes"
        :class="{'profit': position.weeklyChange > 0, 'loss': position.weeklyChange < 0}">
        Weekly<div><span>{{ $helpers.template.asBTC(position.weeklyChange) }}</span> BTC</div>
      </div>
    </div>
  </div>
  <div v-else class="center text-stress f-700 f-16">
    {{ $translate('ERROR_API_SERVER') }}
  </div>
</template>

<script>
export default {
  props: {
    leaderboards: null,
  },
}
</script>

<style lang="scss" scoped>
.bitmex-simple {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;

  .bitmex-position {
    background: var(--background-light);
    padding: 4px 12px;
    font-size: 12px;

    i {
      width: 16px;
    }

    .trader {
      font-weight: 700;
      margin-bottom: 8px;
    }

    .changes {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &.profit span {
        color: var(--price-up-bybit);
      }

      &.loss span {
        color: var(--price-down-bybit);
      }

      i {
        color: var(--bitcoin);;
      }
    }

    &.long {
      background: var(--price-up-bybit-bg);

      .trader {
        color: var(--price-up-bybit);
      }
    }

    &.short {
      background: var(--price-down-bybit-bg);

      .trader {
        color: var(--price-down-bybit);
      }
    }
  }
}
</style>