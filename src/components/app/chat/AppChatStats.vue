<template>
  <div
    @click="$modal.custom({ component: 'ModalChatUsers' })"
    class="app-chat-stats">
    <LongShortRatio :long="ratio.long" :short="ratio.short" class="m-b-8"/>
    <ChatStatsLongShort/>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const ratio = computed(() => {
      const l = store.getters.chatStats.numBulls
      const s = store.getters.chatStats.numBears

      return {
        long: l * 100 / (l + s),
        short: s * 100 / (l + s),
      }
    })

    return {
      ratio,
    }
  },
}
</script>

<style lang="scss">
.app-chat-stats {
  position: absolute;
  z-index: 1;
  top: 49px;
  left: 0;
  right: 0;
  padding: 8px;
  background: linear-gradient(to bottom, var(--background-base), transparent);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  cursor: pointer;

  .long-short-ratio {
    width: 120px;
    margin-left: auto;
    font-size: 12px;
    border-radius: 8px;
    overflow: hidden;
    color: var(--text-stress);
    font-weight: 700;
  }

  &:hover {
    background: linear-gradient(to bottom, var(--brand-primary-hover-bg), transparent);
  }
}
</style>