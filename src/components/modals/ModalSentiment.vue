<template>
  <div class="modal-sentiment">
    <AppImg :src="$helpers.withCdn('images/influencers/hodu_park.jpg')" class="hodu"/>
    <div class="title" v-html="$translate('IS_IT_TIME')"/>
    <div class="flex-row">
      <button
        class="btn btn-bullish m-r-8"
        @click="$emit('close', 'long')">
        {{ $translate('LONG') }} ({{ $translate('BULLISH') }})
      </button>
      <button
        class="btn btn-bearish"
        @click="$emit('close', 'short')">
        {{ $translate('SHORT') }} ({{ $translate('BEARISH') }})
      </button>
    </div>
    <div class="description" v-html="$translate('MODAL_SENTIMENT_DESCRIPTION')"/>
  </div>
</template>

<style lang="scss" scoped>
.modal-sentiment {
  width: 320px;
  padding: 16px;
  text-align: center;

  .hodu {
    width: 80px;
    height: 80px;
    border-radius: 16px;

  }

  .title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-stress);
    margin: 16px 0;
  }

  .description {
    font-size: 12px;
    line-height: 18px;
    margin-top: 40px;
  }

  .btn {
    width: 100%;
    padding: 16px;
    color: var(--white);
  }

  .btn-bullish {
    background: var(--price-up);
  }

  .btn-bearish {
    background: var(--price-down);
  }
}
</style>