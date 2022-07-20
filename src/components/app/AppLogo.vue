<template>
  <RouterLink
    :to="'/'"
    class="app-logo">
    <!-- coinsect.io -->
    <div
      class="text"
      :class="`text-${idx + 1}`"
      :style="{'text-shadow': `-1px -1px ${c}, -1px 1px ${c}, 1px 1px ${c}, 1px -1px ${c}`}"
      :key="c"
      v-for="(c, idx) in colors"
      v-html="'코인충'"
    />
  </RouterLink>
</template>

<script>
import { computed } from 'vue'

export default {
  setup() {
    const colors = computed(() => {
      const op = 1
      return [`rgba(92, 155, 75, ${op})`, `rgba(128, 64, 64, ${op})`, `rgba(192, 192, 255, ${op})`]
    })

    return {
      colors,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-logo {
  color: var(--brand-primary);
  font-size: 24px;
  font-weight: 700;

  height: 24px;
  position: relative;
  display: block;

  .text {
    position: absolute;
    font-size: 24px;
    font-weight: 300;
    white-space: nowrap;
    user-select: none;
    color: var(--black);

    &.text-1 {
      left: 1px;
      top: 1px;
    }

    &.text-2 {
      left: -1px;
      top: -1px;
    }
  }
}
</style>