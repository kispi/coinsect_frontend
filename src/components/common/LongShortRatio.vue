<template>
  <div class="long-short-ratio f-mono">
    <div
      @click="$emit('click-position', 'long')"
      class="ratio-chunk long"
      :style="{ width: `${long}%` }"
      v-html="`${pretty.l}%`"
    />
    <div
      @click="$emit('click-position', 'short')"
      class="ratio-chunk short"
      :style="{ width: `${short}%` }"
      v-html="`${pretty.s}%`"
    />
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  emits: ['click-position'],
  props: {
    long: Number,
    short: Number,
  },
  setup(props) {
    const p = val => (Math.round(val * 100) / 100).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

    const pretty = computed(() => ({ l: p(props.long), s: p(props.short) }))

    return {
      pretty,
    }
  },
}
</script>

<style lang="scss" scoped>
.long-short-ratio {
  display: flex;
  height: 24px;

  .ratio-chunk {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: width 1s ease-in-out;
    white-space: nowrap;

    &.long {
      background: var(--price-up-bybit-bg-20);
    }

    &.short {
      background: var(--price-down-bybit-bg-20);
    }
  }
}
</style>