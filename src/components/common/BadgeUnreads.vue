<template>
  <div
    v-if="numUnreads > 0"
    class="badge-unreads"
    :class="{'small': small}"
    v-html="numUnreads > 99 ? '99+' : numUnreads"
  />
</template>

<script>
export default {
  props: {
    numUnreads: Number,
    small: Boolean,
  },
}
</script>

<style lang="scss" scoped>
.badge-unreads {
  min-width: 24px;
  min-height: 24px;
  border-radius: 12px;
  background: var(--danger);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;

  &.small {
    min-width: 16px;
    min-height: 16px;
    font-size: 10px;
  }

  &:not(.small) {
    padding: 4px;
  }
}
</style>