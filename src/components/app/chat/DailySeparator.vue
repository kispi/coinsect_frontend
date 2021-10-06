<template>
  <div class="daily-separator flex-row items-center">
    <div class="left"></div>
    <div class="timestamp flex-wrap">{{ $helpers.dayjs(message.timestamp).format('YYYY-MM-DD') }}</div>
    <div class="right"></div>
  </div>
</template>

<script>
export default {
  props: ['message'],
}
</script>

<style lang="scss" scoped>
.daily-separator {
  margin: 20px 0;

  .timestamp {
    color: var(--text-base);
    margin: 0 16px;
    font-size: 10px;
  }

  .left,
  .right {
    background: var(--border-base);
    height: 1px;
  }
}
</style>