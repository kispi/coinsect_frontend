<template>
  <div class="app-chat-stats">
    <LongShortRatio
      @click-position="type => updateSentiment({ type, withSound: true })"
      :long="ratio.long"
      :short="ratio.short"
      class="m-b-8"
    />
    <ChatStatsLongShort @click-position="type => updateSentiment({ type, withSound: true })"/>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import useChatHandler from '@/hooks/chat-handler'

export default {
  setup() {
    const store = useStore()

    const { updateSentiment } = useChatHandler()

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
      updateSentiment,
    }
  },
}
</script>

<style lang="scss">
.app-chat-stats {
  position: absolute;
  z-index: 1;
  top: 45px;
  left: 0;
  right: 0;
  padding: 8px;
  background: linear-gradient(to bottom, var(--background-base), transparent);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  pointer-events: none;

  .long-short-ratio {
    width: 120px;
    margin-left: auto;
    font-size: 12px;
    border-radius: 8px;
    overflow: hidden;
    color: var(--text-stress);

    .ratio-chunk {
      cursor: pointer;

      &:hover {
        opacity: 0.5;
      }
    }
  }

  .long-short-ratio,
  .chat-stats-long-short {
    pointer-events: auto;
    cursor: pointer;

    .sentiment {
      &:hover {
        opacity: 0.5;
      }
    }
  }
}
</style>