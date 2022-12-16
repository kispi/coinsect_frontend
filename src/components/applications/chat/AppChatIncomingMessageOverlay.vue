<template>
  <div
    v-if="incomingMessage"
    @click="onClickIncomingMessageOverlay"
    class="app-chat-incoming-message-overlay">
    <div class="flex-row items-center flex-fill lines-1">
      <AppChatProfile :user="incomingMessage.user" class="no-touch flex-wrap"/>
      <div class="text lines-1" v-html="incomingMessage.type === 'image' ? $translate('IMAGE') : incomingMessage.text"/>
    </div>
    <i class="fa fa-chevron-down"/>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import useChatHandler from '@/hooks/chat-handler'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  emits: ['scroll-to-bottom'],
  setup(_, { emit }) {
    const { plugins, store } = useGlobalHooks()

    const incomingMessage = computed(() => store.getters.chat.incomingMessage)

    const ding = ref(null)

    const { filteredMessages: messages } = useChatHandler()

    const debouncedMessageRemover = plugins.$helpers.debounce(() => {
      store.commit('setChat', { incomingMessage: null })
    }, 10000)

    const showIncomingMessageOverlay = () => {
      if (messages.value.length === 0 || store.getters.settings.autoScrollable) return

      store.commit('setChat', { incomingMessage: messages.value[messages.value.length - 1] })

      // 채팅창이 접혀있는 상태인 경우 incomingMessage를 일정시간 후 지워주는게 UX적으로 좋을듯
      if (store.getters.settings.chatFolded) debouncedMessageRemover()
    }

    const onIncomingMessage = async () => {
      showIncomingMessageOverlay()
      if (store.getters.settings.chatFolded) {
        if (ding.value && store.getters.settings.chatDing) {
          try {
            await ding.value.play() // 유저가 페이지에서 상호작용하지 않아 오류가 있더라도 무시
          } catch (e) {}
        }
        return
      }

      // 채팅창이 열려있는 경우의 처리
      if (store.getters.chat.autoScrollable) emit('scroll-to-bottom')

      store.commit('setChat', { lastReadMessage: messages.value[messages.value.length - 1] })
    }

    const onClickIncomingMessageOverlay = () => {
      store.commit('setSettings', { chatFolded: false })
      store.commit('setChat', { incomingMessage: null })
      emit('scroll-to-bottom')
    }

    const loadDing = () => {
      if (typeof Audio === 'undefined') return

      ding.value = new Audio(plugins.$helpers.withCdn('files/ding.mp3'))
      ding.value.volume = 0.2
    }

    onMounted(loadDing)

    watch(
      () => store.getters.chat.lastWebsocketMessage,
      onIncomingMessage,
    )

    return {
      incomingMessage,
      onClickIncomingMessageOverlay,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-chat-incoming-message-overlay {
  position: absolute;
  color: var(--text-stress);
  background: var(--border-base);
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  display: flex;
  align-items: center;
  font-size: 12px;
  padding: 0 12px;
  height: 36px;
  bottom: 88px;
  left: 12px;
  right: 12px;
  z-index: 1;
  cursor: pointer;

  .app-chat-profile {
    white-space: nowrap;
    margin-right: 8px;

    .badge-token {
      background: none;
      border: 1px solid var(--gs-bb);
      color: var(--gs-bb);
    }
  }

  .text {
    flex: 1 1 0;
  }

  .fa-chevron-down {
    flex: 0 0 auto;
    margin-left: 16px;
  }

  &.outside {
    background: var(--brand-primary-hover);
    border: 1px solid rgba(255, 255, 255, 0.24);
    position: fixed;
    top: 24px;
    right: 16px;
    left: initial;
    width: calc(100% - 32px);
    z-index: 5;
  }

  @media (min-width: 480px) {
    &.outside {
      width: 320px;
    }
  }
}
</style>