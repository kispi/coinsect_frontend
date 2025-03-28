<template>
  <div class="chat-background-weather-overlay">
    <div class="top">
      <div class="icons-area"/>
      <div class="icons-area">
        <div
          @click="updateSentiment('long')"
          class="long clickable">
          <i class="fal fa-arrow-trend-up"/>
          {{ store.getters.chatStats.numBulls }}
        </div>
        <div
          @click="updateSentiment('short')"
          class="short clickable">
          <i class="fal fa-arrow-trend-down"/>
          {{ store.getters.chatStats.numBears }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useChatHandler from '@/hooks/chat-handler'
import useGlobalHooks from '@/hooks/global-hooks'

const { updateSentiment } = useChatHandler()

const { store } = useGlobalHooks()
</script>

<style lang="scss" scoped>
.chat-background-weather-overlay {
  position: absolute;
  top: 43px;
  right: 0;
  bottom: 74px;
  left: 0;
  pointer-events: none;

  .top {
    position: absolute;
    top: 1px;
    left: 0;
    right: 0;
    height: 64px;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    background: linear-gradient(to top, rgba(0, 0, 0, 0), var(--app-chat-background));
    font-size: 12px;
    user-select: none;
  }

  .icons-area {
    display: flex;
    padding: 12px;
    gap: 8px;
  }

  .clickable {
    pointer-events: auto;
    cursor: pointer;
  }

  .long {
    color: var(--price-up-bybit);
  }

  .short {
    color: var(--price-down-bybit);
  }
}
</style>
