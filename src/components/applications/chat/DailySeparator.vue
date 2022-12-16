<template>
  <div
    v-if="showSeparator"
    class="daily-separator flex-row items-center">
    <div class="timestamp flex-wrap"><i class="fal fa-calendar-alt m-r-8"/>{{ $helpers.dayjs(message.timestamp).format('YYYY-MM-DD') }}</div>
  </div>
</template>

<script>
import { computed } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  props: ['prevMessage', 'message'],
  setup(props) {
    const { plugins } = useGlobalHooks()

    const d = ts => plugins.$helpers.dayjs(ts).format('YYYY-MM-DD')

    const showSeparator = computed(() => {
      if (!props.prevMessage) return true

      if (!(props.message || {}).timestamp) return false

      return d(props.prevMessage.timestamp) !== d(props.message.timestamp)
    })

    return {
      showSeparator,
    }
  },
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