<template>
  <div class="daily-separator flex-row items-center">
    <div class="timestamp flex-wrap"><i class="fal fa-calendar-alt m-r-8"/>{{ $helpers.dayjs(message.timestamp).format('YYYY-MM-DD') }}</div>
  </div>
</template>

<script>
export default {
  props: ['message'],
}
</script>

<style lang="scss" scoped>
.daily-separator {
  margin: 20px auto 8px;
  background: var(--background-light);
  border-radius: 16px;
  padding: 4px 8px;
  display: table;

  .timestamp {
    color: var(--text-base);
    font-size: 10px;
  }
}
</style>