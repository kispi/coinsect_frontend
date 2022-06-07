<template>
  <div
    ref="refAppChat"
    class="app-chat"
    :class="{
      'folded': $store.getters.settings.chatFolded,
      'max-size': $store.getters.settings.chatSizeMax,
    }">
    <div
      v-if="!$store.getters.settings.chatFolded"
      class="app-chat-container"
      :class="{'transparent': $store.getters.settings.chatTransparent}">
      <AppChatStats/>
      <div class="app-chat-header">
        <div
          v-if="$store.getters.chatUser"
          class="profile">
          <AppImg
            @click="$modal.images({
              images: [$store.getters.chatUser.profile.image],
            })"
            v-if="$store.getters.chatUser.profile.image"
            :src="$store.getters.chatUser.profile.image"
          />
          <div
            @click="openModalChatSettings"
            class="nickname lines-1"
            v-html="$store.getters.chatUser.profile.nickname"
          />
        </div>
        <div class="chat-settings">
          <div
            class="clickable-icon-wrapper"
            @click="toggleChatFolded">
            <i class="fal fa-minus"/>
          </div>
          <div
            class="clickable-icon-wrapper"
            @click="openModalChatSettings">
            <i class="fal fa-cog"/>
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
          class="incoming-message-overlay">
          <AppChatProfile :user="incomingMessage" class="no-touch"/>
          <div class="text lines-1" v-html="incomingMessage.text"/>
          <i class="fa fa-chevron-down"/>
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
          <AppChatMessage
            :prevMessage="messages[idx - 1]"
            :message="message"
            :nextMessage="messages[idx + 1]"
          />
        </div>
      </div>
      <div class="app-chat-input">
        <div class="textarea-wrapper">
          <textarea
            ref="refTextarea"
            v-model="text"
            @keydown="onKeydown"
            :maxlength="120"
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
      class="icon-folded"
      :class="{'chat-ding': $store.getters.settings.chatDing}">
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
import AppChatStats from './AppChatStats'
import DailySeparator from './DailySeparator'
import useChatHandler from '@/hooks/chat-handler'
import useModalDraggable from '@/hooks/modal-draggable'

export default {
  components: {
    AppChatMessage,
    AppChatStats,
    DailySeparator,
  },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const lastReadMessage = ref(null)

    const storedUnreads = ref(null)

    const numUnreads = computed(() => {
      if (storedUnreads.value) return storedUnreads.value

      if ((messages.value || []).length === 0) return 0

      return messages.value.filter(message => {
        if (!lastReadMessage.value) return

        return message.timestamp > lastReadMessage.value.timestamp
      }).length
    })

    const refFoldedIcon = ref(null)

    const refTextarea = ref(null)

    const refAppChatBody = ref(null)

    const refAppChat = ref(null)

    const text = ref('')

    const incomingMessage = ref(null)

    const { makeDraggable } = useModalDraggable()

    const {
      init,
      connected,
      setAccount,
      filteredMessages: messages,
      sendWebsocketMessage,
      loadMessages,
    } = useChatHandler()

    const onKeydown = e => {
      if (e.key === 'Enter') {
        if (!text.value) return

        if (e.shiftKey || store.getters.isMobile) {
          // 커서가 채팅창의 마지막줄에 있을때만 textarea를 끝까지 스크롤함
          if (e.target.value.length - e.target.selectionStart <= 1) refTextarea.value.scrollTop = refTextarea.value.scrollHeight
          return
        }

        e.preventDefault()
        sendTextMessage(text.value, true)
      }

      setTimeout(() => {
        text.value = e.target.value
      })
    }

    const openModalChatSettings = () => {
      plugins.$modal.custom({
        component: 'ModalChatSettings',
        options: {
          setAccount,
        },
      }).then(() => {
        // 바로하면 textarea에서 엔터까지 쳐짐
        setTimeout(() => {
          if (!refTextarea.value) return

          refTextarea.value.focus()
        })
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
      if (!store.getters.settings.chatFolded) {
        storedUnreads.value = 0
        plugins.$helpers.localStorage.setMeta('numUnreads')
      }

      nextTick(() => {
        if (!store.getters.settings.chatFolded) scrollToBottom()
      })
    }

    const autoScrollable = ref(true)

    const onScroll = async e => {
      const dom = e.target
      autoScrollable.value = dom.scrollHeight <= dom.scrollTop + dom.clientHeight + 80

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

    const ding = ref(null)

    const onIncomingMessage = () => {
      if (store.getters.settings.chatFolded) {
        plugins.$helpers.animate.shake(refFoldedIcon.value)
        if (ding.value && store.getters.settings.chatDing) ding.value.play()
        return
      }

      // 채팅창이 열려있는 경우의 처리
      if (autoScrollable.value) {
        scrollToBottom()
      } else {
        showIncomingMessageOverlay()
      }
      lastReadMessage.value = messages.value[messages.value.length - 1]
    }

    const setAppChatPosition = () => {
      if (!refAppChat.value || store.getters.settings.chatFolded) return

      const container = refAppChat.value.getElementsByClassName('app-chat-container')[0]
      if (!container) return

      const rect = container.getBoundingClientRect()
      const padding = 8
      const isMobile = store.getters.windowInnerWidth < 480
      container.style.top = `calc(100% - ${rect.height + padding}px)`
      container.style.left = isMobile ? `${padding}px` : `calc(100% - ${rect.width + padding}px)`
      makeDraggable(refAppChat.value, { toMove: 'app-chat-container', toGrab: 'app-chat-header' })
    }

    const onOpenChatContainer = () => nextTick(() => {
      refTextarea.value.focus()
      scrollToBottom()
      setAppChatPosition()
    })

    watch(
      () => store.getters.settings.chatFolded,
      (newVal, oldVal) => {
        if (!newVal && oldVal) onOpenChatContainer()
      },
    )

    watch(
      () => store.getters.settings.blockedUsers,
      onOpenChatContainer,
    )

    watch(
      () => numUnreads.value,
      newVal => {
        if (newVal > 0) {
          plugins.$helpers.localStorage.setMeta('numUnreads', newVal)
        }
      },
    )

    watch([
      () => store.getters.windowInnerWidth,
      () => store.getters.windowInnerHeight,
      () => store.getters.settings.chatSizeMax,
    ],
      () => setTimeout(setAppChatPosition),
    )

    onMounted(() => {
      storedUnreads.value = plugins.$helpers.localStorage.getMeta('numUnreads')

      plugins.$bus.$on('incoming-message', onIncomingMessage)
      plugins.$bus.$on('first-load-messages', scrollToBottom) // 사실상 이 컴포넌트가 마운트됐을때만 실행되는거라 굳이 이렇게 하고싶진 않지만 별 방법이 없는듯...

      init()
      setAppChatPosition()

      if (typeof Audio === 'undefined') return

      ding.value = new Audio(plugins.$helpers.useS3('files/ding.mp3'))
      ding.value.volume = 0.2
    })

    onUnmounted(() => {
      plugins.$bus.$off('incoming-message', onIncomingMessage)
      plugins.$bus.$off('first-load-messages', scrollToBottom)
    })

    return {
      refFoldedIcon,
      refTextarea,
      refAppChatBody,
      refAppChat,
      numUnreads,
      connected,
      storedUnreads,
      text,
      messages,
      onKeydown,
      incomingMessage,
      openModalChatSettings,
      onClickIncomingMessageOverlay,
      sendTextMessage,
      toggleChatFolded,
      autoScrollable,
      scrollToBottom,
      onScroll,
    }
  },
}
</script>

<style lang="scss">
.app-chat {
  --app-chat-padding: 12px;
  transition: none;

  .fa-paper-plane {
    cursor: pointer;

    &:hover {
      color: var(--text-stress);
    }
  }

  .app-chat-container,
  .icon-folded {
    position: fixed;
    z-index: 5;
  }

  .app-chat-container {
    border: 1px solid var(--border-light);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    margin: auto;
    background: var(--border-base);
    width: 320px;
    height: 400px;
    max-height: calc(100vh - 16px); // 100vh - 2 * bottom padding
    transition: none;

    @media (max-width: 479px) {
      width: calc(100% - 16px);
    }
  }

  .app-chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--app-chat-padding);
    user-select: none;
    cursor: grab;

    .profile {
      display: flex;

      .app-img {
        width: 16px;
        height: 16px;
        margin-right: 4px;
        border-radius: 50%;
      }

      .nickname {
        color: var(--text-stress);
        font-weight: 700;
        text-decoration: underline;
      }

      .app-img,
      .nickname {
        transition: none;
        cursor: pointer;
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
  }

  .app-chat-input {
    padding: calc(var(--app-chat-padding) / 2) var(--app-chat-padding);

    .textarea-wrapper {
      border-radius: 4px;
      background: var(--background-light);
      width: 100%;
      display: flex;
      align-items: center;
      padding: 8px;

      textarea {
        padding-right: 16px;
        font-size: 12px;
        line-height: 18px;
        height: 44px;
      }

      .fa-paper-plane {
        font-size: 16px;
        cursor: pointer;
      }
    }
  }

  .icon-folded {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--brand-primary-50);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.24);
    border-radius: 50%;
    right: 8px;
    bottom: 8px;
    cursor: pointer;

    &.chat-ding {
      background: var(--brand-primary);
    }

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
  }

  &:not(.folded) {
    @media (min-width: 480px) {
      .app-chat-container {
        width: 320px;
      }
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

      &.transparent {
        background: rgba(255, 255, 255, 0.75);
      }

      .app-chat-body {
        border-top: 1px solid var(--border-base);
        border-bottom: 1px solid var(--border-base);
      }
    }
  }

  &.dark {
    .app-chat-container {
      background: var(--gs-22);

      &.transparent {
        background: rgba(34, 34, 34, 0.75);
      }

      .app-chat-body {
        border-top: 1px solid var(--gs-44);
        border-bottom: 1px solid var(--gs-44);
      }
    }
  }
}
</style>