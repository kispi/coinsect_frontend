<template>
  <div class="exchange-banner" :class="{'simple': simple}">
    <div class="img-container">
      <AppImg :src="(exchanges[exchange] || {}).src" draggable="false"/>
    </div>
    <div class="promotion" v-html="(referrals[exchange] || {}).promotion"/>
  </div>
</template>

<script>
import referrals from '@/assets/constants/referrals'
import exchanges from '@/assets/constants/exchanges'

export default {
  props: {
    exchange: String,
    simple: Boolean,
  },
  setup() {
    return {
      referrals,
      exchanges,
    }
  },
}
</script>

<style lang="scss" scoped>
.exchange-banner {
  width: 100%;
  gap: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gs-bybit);
  border: 1px solid var(--border-base);
  transition: all 0.2s ease-in-out;
  user-select: none;
  font-size: 12px;
  padding: 8px;
  text-align: center;
  cursor: pointer;

  .img-container {
    position: relative;
    width: 48px;
    height: 48px;
    flex: 0 0 auto;
    display: flex;
    align-items: center;

    img {
      width: 100%;
    }
  }

  .promotion {
    color: var(--white);
    flex: 1;
    white-space: pre-line;
  }

  &:hover {
    border: 1px solid var(--white);
  }

  &.simple {
    padding: 0;

    .promotion {
      display: none;
    }
  }
}
</style>