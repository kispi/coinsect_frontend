<template>
  <div
    @click="toggleChatFolded"
    class="app-chat-toggler"
    :class="{
      'chat-ding': $store.getters.settings.chatDing,
      'folded': !$store.getters.settings.chatFolded,
    }">
    <i class="fal fa-comment-dots"/>
    <div
      v-if="numUnreads"
      class="badge-unreads center f-mono">
      {{ numUnreads > 99 ? '99+' : numUnreads }}
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import useChatHandler from '@/hooks/chat-handler'

export default {
  emits: ['scroll-to-bottom'],
  setup(_, { emit }) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const { filteredMessages: messages } = useChatHandler()

    const numUnreads = computed(() => {
      return (messages.value || []).filter(message => {
        if (!store.getters.chat.lastReadMessage) return

        return message.timestamp > store.getters.chat.lastReadMessage.timestamp
      }).length
    })

    const toggleChatFolded = () => {
      store.commit('setSettings', { chatFolded: !store.getters.settings.chatFolded })
      // 펼쳐진 경우, 현재 로드된 마지막 메시지가 lastReadMessage가 되어야한다.
      if (!store.getters.settings.chatFolded) store.commit('setChat', { lastReadMessage: messages.value[messages.value.length - 1] })

      nextTick(() => {
        if (!store.getters.settings.chatFolded) emit('scroll-to-bottom')
      })
    }

    onMounted(() => {
      store.commit('setChat', { lastReadMessage: plugins.$helpers.localStorage.getMeta('lastReadMessage') })
    })

    return {
      numUnreads,
      toggleChatFolded,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-chat-toggler {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--brand-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.24);
  border-radius: 50%;
  right: 8px;
  bottom: 8px;
  cursor: pointer;

  .fa-comment-dots {
    font-size: 24px;
    color: var(--white);
  }

  .badge-unreads {
    min-width: 24px;
    min-height: 24px;
    padding: 4px;
    border-radius: 12px;
    background: var(--danger);
    color: var(--white);
    position: absolute;
    top: 0;
    right: 0;
  }

  &:hover {
    background: var(--brand-primary-hover);
  }

  &:not(.chat-ding) {
    background: var(--brand-primary);
    opacity: 0.5;
  }

  &.folded {
    opacity: 0;
    pointer-events: none;
  }
}
</style>