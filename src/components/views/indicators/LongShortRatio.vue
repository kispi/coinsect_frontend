<template>
  <div class="long-short-ratio f-mono">
    <div
      class="ratio-chunk long"
      :style="{ width: `${long}%` }"
      v-html="`${long}%`"
    />
    <div
      class="ratio-chunk short"
      :style="{ width: `${short}%` }"
      v-html="`${short}%`"
    />
  </div>
</template>

<script>
export default {
  props: {
    long: Number,
    short: Number,
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
      background: var(--price-up-bg);
    }

    &.short {
      background: var(--price-down-bg);
    }
  }
}
</style>