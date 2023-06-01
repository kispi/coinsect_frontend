<template>
  <div
    ref="refAppChat"
    class="app-chat"
    :class="{
      'folded': $store.getters.settings.chatFolded,
      'max-size': $store.getters.settings.chatSizeMax,
      'transparent': $store.getters.settings.chatTransparent,
      [$store.getters.settings.chatSkin]: true,
    }">
    <div
      class="app-chat-container"
      :class="{
        'display-none': $store.getters.settings.chatFolded,
      }">
      <AppChatHeader/> <!-- 다른 컴포넌트의 함수를 참조하는게 안티패턴같긴 하지만 ... -->
      <div
        ref="refAppChatBody"
        class="app-chat-body no-scrollbar"
        @scroll="onScroll">
        <AppLoading :loading="loadingReplyTarget"/>
        <ChatBackgroundWeatherOverlay/>
        <AppChatIncomingMessageOverlay @scroll-to-bottom="scrollToBottom"/>
        <div
          @click="scrollToBottom"
          class="clickable-icon-wrapper scroll-to-bottom"
          :class="{'hide': $store.getters.chat.autoScrollable}">
          <i class="fa fa-chevron-down"/>
        </div>
        <div
          class="app-chat-message-wrapper"
          :class="[
            (!(messages[idx - 1] ||{}).isMine && (message || {}).isMine) ? 'm-t-12' : '',
            `mid-${message.id}`
          ]"
          :key="message.id"
          v-for="(message, idx) in messages">
          <DailySeparator
            :prevMessage="messages[idx - 1]"
            :message="message"
          />
          <AppChatMessage
            @click-write-reply="onClickWriteReply"
            @click-replied-message="onClickRepliedMessage"
            :prevMessage="messages[idx - 1]"
            :message="message"
            :nextMessage="messages[idx + 1]"
          />
          <!-- 이미지 메시지는 아래 컴포넌트 렌더링할 필요 없음 -->
          <AppChatMessageMetaTags
            v-if="message.type !== 'image' && !message.$$hide"
            :message="message"
            @scroll-to-bottom="scrollToBottom"
          />
        </div>
      </div>
      <AppChatInput ref="refAppChatInput"/>
    </div>
    <AppChatIncomingMessageOverlay
      v-if="$store.getters.settings.chatOverlayNewMessage && $store.getters.settings.chatFolded"
      class="outside"
    />
  </div>
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import AppChatHeader from './AppChatHeader'
import AppChatMessage from './AppChatMessage'
import AppChatMessageMetaTags from './AppChatMessageMetaTags'
import AppChatIncomingMessageOverlay from './AppChatIncomingMessageOverlay'
import AppChatInput from './AppChatInput'
import ChatBackgroundWeatherOverlay from './ChatBackgroundWeatherOverlay'
import DailySeparator from './DailySeparator'
import communityService from '@/services/community'
import useChatHandler from '@/hooks/chat-handler'
import useModalDraggable from '@/hooks/modal-draggable'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  components: {
    AppChatHeader,
    AppChatMessage,
    AppChatMessageMetaTags,
    AppChatIncomingMessageOverlay,
    AppChatInput,
    ChatBackgroundWeatherOverlay,
    DailySeparator,
  },
  setup() {
    const { plugins, store } = useGlobalHooks()

    const refAppChatBody = ref(null)

    const refAppChatInput = ref(null)

    const refAppChat = ref(null)

    const loadingReplyTarget = ref(null)

    const { makeDraggable } = useModalDraggable()

    const {
      init,
      messages: originalMessages,
      filteredMessages: messages,
      loadMessages,
    } = useChatHandler()

    const onScroll = async e => {
      const dom = e.target
      store.commit('setChat', { autoScrollable: dom.scrollHeight <= dom.scrollTop + dom.clientHeight + 80 })

      if (dom.scrollTop === 0) {
        // 더 불러와진 과거의 메시지들이 추가되면 현재 위치로 다시 스크롤 위치를 맞춰줘야함
        const previousScrollHeight = dom.scrollHeight
        await loadMessages()
        dom.scrollTop = dom.scrollHeight - previousScrollHeight
      }

      if (store.getters.chat.autoScrollable && store.getters.chat.incomingMessage) store.commit('setChat', { incomingMessage: null })
    }

    const scrollToBottom = () => {
      // 바닥까지 스크롤된 경우 당연히 마지막 메시지가 최종 읽은 메시지이다.
      if (!store.getters.settings.chatFolded) store.commit('setChat', { lastReadMessage: messages.value[messages.value.length - 1] })

      const dom = refAppChatBody.value
      if (!dom) return

      setTimeout(() => dom.scrollTop = dom.scrollHeight)
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

    const onClickRepliedMessage = async message => {
      loadingReplyTarget.value = true
      let found = originalMessages.value.find(o => o.id === message.id)
      if (!found) {
        for (let i = 0; i < 4; i++) {
          found = (await loadMessages(500) || []).find(o => o.id === message.id)
          if (found) break
        }
      }
      loadingReplyTarget.value = false

      if (!found) {
        plugins.$toast.error('너무 오래된 메시지인 것 같아요 😥')
        return
      }

      await plugins.$helpers.sleep(100)
      const dom = refAppChatBody.value.getElementsByClassName(`mid-${found.id}`)[0]
      if (dom) dom.scrollIntoView({ behavior: 'smooth' })
      else plugins.$toast.error(`차단한 유저(${message.nickname})의 메시지입니다`)
    }

    const onClickWriteReply = async writingReplyTo => {
      store.commit('setChat', { writingReplyTo: store.getters.chat.writingReplyTo ? null : writingReplyTo })
      setTimeout(() => {
        if (refAppChatInput.value) refAppChatInput.value.refTextarea.focus()
      })
    }

    const onOpenChatContainer = () => setTimeout(() => {
      scrollToBottom()
      setAppChatPosition()
      if (refAppChatInput.value) refAppChatInput.value.refTextarea.focus()
    })

    watch(
      () => store.getters.chat.lastWebsocketMessage,
      () => {
        if (!store.getters.documentVisible) plugins.$helpers.useFaviconWithUnreads(true)
      },
    )

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

    watch([
      () => store.getters.windowInnerWidth,
      () => store.getters.windowInnerHeight,
      () => store.getters.settings.chatSizeMax,
    ],
      () => setTimeout(setAppChatPosition),
    )

    onMounted(() => {
      plugins.$bus.$on('scroll-to-bottom', scrollToBottom) // 사실상 이 컴포넌트가 마운트됐을때만 실행되는거라 굳이 이렇게 하고싶진 않지만 별 방법이 없는듯...

      init()
      setAppChatPosition()
    })

    onUnmounted(() => {
      plugins.$bus.$off('scroll-to-bottom', scrollToBottom)

      /*
        <AppChat/>이 unmount되는 경우는, 로그인/로그아웃 뿐이다. 이 경우 상태관리의 편의를 위해 <AppChat/>을 rerender하기 때문에, connection도 새로 만들어진다.
        따라서 기존 connection은 dangling상태가 되므로 그것을 인위적으로 없애준다.
        이렇게 인위로 connection을 close하는 경우는 chat-handler.js에서 접속 끊길 시 5초마다 reconnect시도하는 코드가 돌지 않도록 preventAutoReconnect 플래그를 넣어준다.
      */
      if (store.getters.chat.connection) {
        store.commit('setChat', { preventAutoReconnect: true })
        store.getters.chat.connection.close()
      }
    })

    return {
      refAppChatBody,
      refAppChatInput,
      refAppChat,
      messages,
      loadingReplyTarget,
      onClickWriteReply,
      onClickRepliedMessage,
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

  &.transparent {
    opacity: 0.5;
  }

  .fa-paper-plane {
    cursor: pointer;

    &:hover {
      color: var(--text-stress);
    }
  }

  .app-chat-container {
    border: 1px solid var(--text-stress);
    background: var(--app-chat-background);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    margin: auto;
    width: 320px;
    height: 480px;
    max-height: calc(100vh - 16px); // 100vh - 2 * bottom padding
    transition: none;
    resize: both;
    overflow: hidden;
    position: fixed;
    z-index: 5;

    @media (max-width: 479px) {
      width: calc(100% - 16px);
    }
  }

  .app-chat-body {
    overflow-y: auto;
    overscroll-behavior: contain;
    border-top: 1px solid var(--border-base);
    border-bottom: 1px solid var(--border-base);
    padding: var(--app-chat-padding);
    flex: 1;

    .scroll-to-bottom {
      position: absolute;
      z-index: 1;
      right: 8px;
      bottom: 88px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid var(--border-light);
      background: var(--background-base);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.24);
      transition: all 0.2s ease;

      &.hide {
        opacity: 0;
        pointer-events: none;
        transform: scale(0);
      }
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
    --app-chat-background: var(--white);
  }

  &.dark {
    --app-chat-background: var(--gs-22);
  }

  .app-chat.kakao {
    --bg-kakao-chat: #bacee0;
    --bg-kakao-my-message: #ffeb33;
    --background-base: var(--white);
    --background-light: rgba(255, 255, 255, 0.25);
    --text-stress: var(--black);
    --border-base: var(--gs-e0);

    .app-chat-container {
      --app-chat-background: var(--bg-kakao-chat);
      border: 1px solid var(--border-base);
      color: var(--text-stress);
    }

    .app-chat-stats {
      background: linear-gradient(to bottom, var(--bg-kakao-chat), transparent);
    }

    .app-chat-incoming-message-overlay {
      &.outside {
        color: var(--white);

        .app-chat-profile {
          .nickname {
            color: var(--white);
          }
        }
      }

      &:not(.outside) {
        background: var(--white);
      }
    }

    .app-chat-message {
      &.mine {
        .text-and-timestamp {
          .text {
            background: var(--bg-kakao-my-message);
          }
        }
      }

      .text-and-timestamp {
        .text {
          background: var(--white);
        }
      }
    }

    .app-chat-input {
      .textarea-wrapper {
        background: var(--white);
      }
    }

    .daily-separator .timestamp {
      color: var(--gs-44);
    }
  }
}
</style>
