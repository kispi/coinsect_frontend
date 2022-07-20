<template>
  <div class="app-chat-stats">
    <LongShortRatio
      @click-position="updateSentiment"
      :long="ratio.long"
      :short="ratio.short"
      class="m-b-8"
    />
    <ChatStatsLongShort @click-position="updateSentiment"/>
  </div>
</template>

<script>
import { computed, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import useChatHandler from '@/hooks/chat-handler'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const { setAccount } = useChatHandler()

    const ratio = computed(() => {
      const l = store.getters.chatStats.numBulls
      const s = store.getters.chatStats.numBears

      return {
        long: l * 100 / (l + s),
        short: s * 100 / (l + s),
      }
    })

    const updateSentiment = async type => {
      const p = store.getters.chatUser.profile
      p.sentiment = { type }
      try {
        await setAccount(p)
        plugins.$toast.success(`${type === 'long' ? '롱' : '숏'}으로 가보자!`)
      } catch (e) {}
    }

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
  top: 49px;
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
    font-weight: 700;

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