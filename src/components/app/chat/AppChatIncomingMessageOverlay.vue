<template>
  <div
    v-if="incomingMessage"
    @click="onClickIncomingMessageOverlay"
    class="app-chat-incoming-message-overlay">
    <div class="flex-row items-center flex-fill lines-1">
      <AppChatProfile :user="incomingMessage" class="no-touch flex-wrap"/>
      <div class="text lines-1" v-html="incomingMessage.type === 'image' ? $translate('IMAGE') : incomingMessage.text"/>
    </div>
    <i class="fa fa-chevron-down"/>
  </div>
</template>

<script>
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import useChatHandler from '@/hooks/chat-handler'

export default {
  emits: ['scroll-to-bottom'],
  props: {
    refFoldedIcon: null,
  },
  setup(props, { emit }) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const incomingMessage = computed(() => store.getters.chat.incomingMessage)

    const ding = ref(null)

    const { filteredMessages: messages } = useChatHandler()

    const showIncomingMessageOverlay = () => {
      if (messages.value.length === 0) return

      store.commit('setChat', { incomingMessage: messages.value[messages.value.length - 1] })
    }

    const onIncomingMessage = async () => {
      if (store.getters.settings.chatFolded) {
        plugins.$helpers.animate.shake(props.refFoldedIcon.$el)
        if (ding.value && store.getters.settings.chatDing) {
          try {
            await ding.value.play() // 유저가 페이지에서 상호작용하지 않아 오류가 있더라도 무시
          } catch (e) {}
        }
        return
      }

      // 채팅창이 열려있는 경우의 처리
      if (store.getters.chat.autoScrollable) {
        emit('scroll-to-bottom')
      } else {
        showIncomingMessageOverlay()
      }
      store.commit('setChat', { lastReadMessage: messages.value[messages.value.length - 1] })
    }

    const onClickIncomingMessageOverlay = () => {
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
}
</style>