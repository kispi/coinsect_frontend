<template>
  <div
    v-if="$store.getters.chatStats"
    class="chat-stats-long-short f-mono">
    <div class="sentiment long">
      <i class="fa fa-arrow-trend-up"/>
      <span v-if="useText" class="m-r-4">Bulls:</span>
      <span>{{ $store.getters.chatStats.numBulls }}</span>
    </div>
    <div class="sentiment short">
      <i class="fa fa-arrow-trend-down"/>
      <span v-if="useText" class="m-r-4">Bears:</span>
      <span>{{ $store.getters.chatStats.numBears }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    useText: Boolean,
  },
}
</script>
<style lang="scss" scoped>
.chat-stats-long-short {
  display: flex;
  font-size: 12px;

  .sentiment {
    display: flex;
    align-items: center;

    i {
      margin-right: 4px;
    }

    span {
      white-space: nowrap;
    }

    &.long {
      color: var(--price-up);
    }

    &.short {
      color: var(--price-down);
    }

    &:not(:last-child) {
      margin-right: 4px;
    }
  }
}
</style>