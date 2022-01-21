<template>
  <div
    class="app-chat"
    :class="{
      'folded': $store.getters.settings.chatFolded,
      'max-size': $store.getters.settings.chatSizeMax,
    }">
    <div
      v-if="!$store.getters.settings.chatFolded"
      class="app-chat-container">
      <div class="app-chat-header">
        <div
          @click="openModalChangeProfile"
          class="profile">
          <div class="nickname" v-html="profile.nickname"/>
        </div>
        <div class="chat-settings">
          <div
            class="clickable-icon-wrapper"
            @click="toggleChatFolded">
            <i class="fal fa-minus"/>
          </div>
          <div
            class="clickable-icon-wrapper"
            @click="toggleChatSizeMax">
            <i
              class="fal"
              :class="$store.getters.settings.chatSizeMax ? 'fa-clone' : 'fa-square'"
            />
          </div>
        </div>
      </div>
      <div
        ref="refAppChatBody"
        class="app-chat-body no-scrollbar"
        @scroll="onScroll">
        <div
          v-if="incomingMessage"
          @click="onClickIncomingMessageOverlay"
          class="incoming-message-overlay flex-row items-center">
          <div class="flex-fill flex-row items-center">
            <div class="flex-fill">
              <div class="text flex-wrap lines-1" v-html="incomingMessage.text"/>
              <div class="nickname lines-1" v-html="incomingMessage.profile.nickname"/>
            </div>
            <i class="fa fa-chevron-down flex-wrap"/>
          </div>
        </div>
        <div
          @click="scrollToBottom"
          class="clickable-icon-wrapper scroll-to-bottom"
          :class="{'o-0 no-touch': autoScrollable}">
          <i class="fa fa-chevron-down"/>
        </div>
        <div
          class="app-chat-message-wrapper"
          :key="idx"
          v-for="(message, idx) in messages">
          <DailySeparator
            v-if="message.$$showSeparator"
            :message="message"
          />
          <AppChatMessage :message="message"/>
        </div>
      </div>
      <div class="app-chat-input">
        <div class="textarea-wrapper">
          <textarea
            ref="refTextarea"
            v-model="text"
            @keydown="onKeydown"
            @keydown.prevent.enter
            maxlength="120"
            class="no-scrollbar"
          />
          <i
            v-if="text"
            @click="sendTextMessage(text, true)"
            class="fa fa-paper-plane"
          />
        </div>
      </div>
    </div>
    <div
      v-else
      ref="refFoldedIcon"
      @click="toggleChatFolded"
      class="icon-folded">
      <i class="fal fa-comment-dots"/>
      <div
        v-if="numUnreads"
        class="badge-unreads center">
        {{ numUnreads > 999 ? '999+' : numUnreads }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import AppChatMessage from './AppChatMessage'
import DailySeparator from './DailySeparator'
import useChatHandler from '@/hooks/chat-handler'

export default {
  components: {
    AppChatMessage,
    DailySeparator,
  },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const lastReadMessage = ref(null)

    const numUnreads = computed(() => {
      if ((messages.value || []).length === 0) return 0

      return messages.value.filter(message => {
        if (!lastReadMessage.value) return

        return message.timestamp > lastReadMessage.value.timestamp
      }).length
    })

    const refFoldedIcon = ref(null)

    const refTextarea = ref(null)

    const refAppChatBody = ref(null)

    const text = ref('')

    const incomingMessage = ref(null)

    const {
      init,
      connected,
      setLocalAccount,
      profile,
      messages,
      sendWebsocketMessage,
      loadMessages,
    } = useChatHandler()

    const onKeydown = e => {
      setTimeout(() => {
        text.value = e.target.value
        if (e.key === 'Enter') {
          if (e.shiftKey && text.value) {
            text.value += '\n'
            setTimeout(() => refTextarea.value.scrollTop = refTextarea.value.scrollHeight)
          }
          else sendTextMessage(text.value, true)
        }
      })
    }

    const openModalChangeProfile = () => {
      plugins.$modal.custom({
        component: 'ModalChatProfile',
        options: {
          profile: {
            nickname: profile.value.nickname,
          },
        },
      }).then(result => {
        if (result) profile.value = result

        setLocalAccount()
      })
    }

    const sendTextMessage = incomingText => {
      if (!(incomingText || '').trim()) return

      sendWebsocketMessage({
        type: 'text',
        text: incomingText,
      })

      text.value = ''

      if (refTextarea.value) nextTick(() => refTextarea.value.focus())
    }

    const toggleChatFolded = () => {
      store.commit('setSettings', { chatFolded: !store.getters.settings.chatFolded })

      nextTick(() => {
        if (!store.getters.settings.chatFolded) scrollToBottom()
      })
    }

    const toggleChatSizeMax = () => {
      store.commit('setSettings', { chatSizeMax: !store.getters.settings.chatSizeMax })
    }

    const autoScrollable = ref(true)

    const onScroll = async e => {
      const dom = e.target
      autoScrollable.value = dom.scrollHeight <= dom.scrollTop + dom.clientHeight + 320

      if (dom.scrollTop === 0) {
        // 더 불러와진 과거의 메시지들이 추가되면 현재 위치로 다시 스크롤 위치를 맞춰줘야함
        const previousScrollHeight = dom.scrollHeight
        await loadMessages()
        dom.scrollTop = dom.scrollHeight - previousScrollHeight
      }

      if (autoScrollable.value && incomingMessage.value) incomingMessage.value = null
    }

    const onClickIncomingMessageOverlay = () => {
      incomingMessage.value = null
      scrollToBottom()
    }

    const showIncomingMessageOverlay = () => {
      if ((messages.value || []).length === 0) return

      incomingMessage.value = messages.value[messages.value.length - 1]
    }

    const scrollToBottom = () => {
      // 바닥까지 스크롤된 경우 당연히 마지막 메시지가 최종 읽은 메시지이다.
      lastReadMessage.value = messages.value[messages.value.length - 1]

      const dom = refAppChatBody.value
      if (!dom) return

      nextTick(() => dom.scrollTop = dom.scrollHeight)
    }

    const onIncomingMessage = () => {
      if (store.getters.settings.chatFolded) return

      // 채팅창이 열려있는 경우의 처리
      if (autoScrollable.value) {
        scrollToBottom()
      } else {
        showIncomingMessageOverlay()
      }
      lastReadMessage.value = messages.value[messages.value.length - 1]
    }

    watch(
      () => store.getters.settings.chatFolded,
      (newVal, oldVal) => {
        if (!newVal && oldVal) nextTick(() => {
          refTextarea.value.focus()
          scrollToBottom()
        })
      },
    )

    onMounted(() => {
      plugins.$bus.$on('incoming-message', onIncomingMessage)
      plugins.$bus.$on('first-load-messages', scrollToBottom) // 사실상 이 컴포넌트가 마운트됐을때만 실행되는거라 굳이 이렇게 하고싶진 않지만 별 방법이 없는듯...

      init()
    })

    onUnmounted(() => {
      plugins.$bus.$off('incoming-message', onIncomingMessage)
      plugins.$bus.$off('first-load-messages', scrollToBottom)
    })

    return {
      refFoldedIcon,
      refTextarea,
      refAppChatBody,
      numUnreads,
      connected,
      profile,
      text,
      messages,
      onKeydown,
      incomingMessage,
      openModalChangeProfile,
      onClickIncomingMessageOverlay,
      sendTextMessage,
      toggleChatFolded,
      toggleChatSizeMax,
      autoScrollable,
      scrollToBottom,
      onScroll,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-chat {
  --app-chat-padding: 12px;
  position: fixed;
  z-index: 5;
  bottom: 8px;
  right: 8px;
  transition: none;

  .fa-paper-plane {
    cursor: pointer;

    &:hover {
      color: var(--text-stress);
    }
  }

  .app-chat-container {
    border: 1px solid var(--border-light);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    margin: auto;
    background: var(--border-base);
    height: 400px;
    max-height: calc(100vh - 16px); // 100vh - 2 * bottom padding
    transition: none;
    position: relative;

    @media (max-width: 479px) {
      width: calc(100% - 32px);
    }
  }

  .app-chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--app-chat-padding);

    .nickname {
      color: var(--text-stress);
      margin-right: 16px;
      font-weight: 700;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    .chat-settings {
      display: flex;
      align-items: center;

      .clickable-icon-wrapper {
        width: 24px;
        height: 24px;

        &:not(:first-child) {
          margin-left: 8px;
        }
      }
    }
  }

  .app-chat-body {
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: var(--app-chat-padding);
    flex: 1;

    .scroll-to-bottom {
      position: absolute;
      right: 8px;
      bottom: 88px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid var(--border-light);
      background: var(--background-base);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.24);
      transition: all 0.2s ease;
    }

    .incoming-message-overlay {
      position: absolute;
      color: var(--gs-14);
      background: rgba(255, 255, 255, 0.75);
      border-radius: 4px;
      padding: 4px 12px;
      bottom: 88px;
      left: 12px;
      right: 12px;
      z-index: 1;
      cursor: pointer;

      .nickname {
        font-size: 12px;
        margin-top: 4px;
      }
    }
  }

  .app-chat-message-wrapper {
    &:not(:last-child) {
      margin-bottom: 12px;
    }
  }

  .app-chat-input {
    padding: calc(var(--app-chat-padding) / 2) var(--app-chat-padding);

    .textarea-wrapper {
      border-radius: 4px;
      background: var(--background-light);
      width: 100%;
      display: flex;
      align-items: center;
      padding: 8px 16px;

      textarea {
        padding-right: 16px;
        font-size: 12px;
      }

      .fa-paper-plane {
        font-size: 16px;
        cursor: pointer;
      }
    }
  }

  .icon-folded {
    padding: 12px;
    background: var(--brand-primary);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.24);
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;

    .fa-comment-dots {
      font-size: 32px;
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
  }

  &:not(.folded) {
    @media (max-width: 479px) {
      right: 0;
      left: 0;
    }

    @media (min-width: 480px) {
      width: 320px;
    }

    &.max-size {
      top: 48px;

      .app-chat-container {
        height: 100%;
      }
    }
  }
}

#app {
  &.light {
    .app-chat-container {
      background: var(--white);

      .app-chat-body {
        border-top: 1px solid var(--border-base);
        border-bottom: 1px solid var(--border-base);
      }
    }
  }

  &.dark {
    .app-chat-container {
      background: var(--gs-22);

      .app-chat-body {
        border-top: 1px solid var(--gs-44);
        border-bottom: 1px solid var(--gs-44);
      }
    }
  }
}
</style>