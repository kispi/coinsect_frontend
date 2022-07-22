<template>
  <div
    ref="refAppChat"
    class="app-chat"
    :class="{
      'folded': $store.getters.settings.chatFolded,
      'max-size': $store.getters.settings.chatSizeMax,
      'transparent': $store.getters.settings.chatTransparent,
    }">
    <div
      class="app-chat-container"
      :class="{
        'display-none': $store.getters.settings.chatFolded,
      }">
      <AppChatStats/>
      <AppChatHeader :toggleChatFolded="(refFoldedIcon || {}).toggleChatFolded"/> <!-- 다른 컴포넌트의 함수를 참조하는게 안티패턴같긴 하지만 ... -->
      <div
        ref="refAppChatBody"
        class="app-chat-body no-scrollbar"
        @scroll="onScroll">
        <AppLoading :loading="loadingReplyTarget"/>
        <AppChatIncomingMessageOverlay :scrollToBottom="scrollToBottom" :refFoldedIcon="refFoldedIcon"/>
        <div
          @click="scrollToBottom"
          class="clickable-icon-wrapper scroll-to-bottom"
          :class="{'o-0 no-touch': $store.getters.chat.autoScrollable}">
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
            v-if="message.$$showSeparator"
            :message="message"
          />
          <AppChatMessage
            @click-function="onClickMessageFunction"
            @click-replied-message="onClickRepliedMessage"
            :prevMessage="messages[idx - 1]"
            :message="message"
            :nextMessage="messages[idx + 1]"
          />
          <!-- 이미지 메시지는 아래 컴포넌트 렌더링할 필요 없음 -->
          <AppChatMessageMetaTags
            v-if="message.type !== 'image'"
            :message="message"
            :scrollToBottom="scrollToBottom"
          />
        </div>
      </div>
      <AppChatInput ref="refAppChatInput"/>
    </div>
    <AppChatToggler ref="refFoldedIcon" :scrollToBottom="scrollToBottom"/>
  </div>
</template>

<script>
import { ref, getCurrentInstance, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import AppChatHeader from './AppChatHeader'
import AppChatMessage from './AppChatMessage'
import AppChatMessageMetaTags from './AppChatMessageMetaTags'
import AppChatIncomingMessageOverlay from './AppChatIncomingMessageOverlay'
import AppChatInput from './AppChatInput'
import AppChatToggler from './AppChatToggler'
import AppChatStats from './AppChatStats'
import DailySeparator from './DailySeparator'
import useChatHandler from '@/hooks/chat-handler'
import useModalDraggable from '@/hooks/modal-draggable'

export default {
  components: {
    AppChatHeader,
    AppChatMessage,
    AppChatMessageMetaTags,
    AppChatIncomingMessageOverlay,
    AppChatInput,
    AppChatToggler,
    AppChatStats,
    DailySeparator,
  },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const refFoldedIcon = ref(null)

    const refAppChatBody = ref(null)

    const refAppChatInput = ref(null)

    const refAppChat = ref(null)

    const loadingReplyTarget = ref(null)

    const { makeDraggable } = useModalDraggable()

    const {
      init,
      connected,
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
      store.commit('setChat', { lastReadMessage: messages.value[messages.value.length - 1] })

      const dom = refAppChatBody.value
      if (!dom) return

      nextTick(() => dom.scrollTop = dom.scrollHeight)
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
      let found = messages.value.find(o => o.id === message.id)
      if (!found) {
        for (let i = 0; i < 50; i++) {
          found = (await loadMessages(500) || []).find(o => o.id === message.id)
          if (found) break
        }
      }
      loadingReplyTarget.value = false

      if (!found) {
        plugins.$toast.error('너무 오래된 메시지라 찾지 못했습니다 :(')
        return
      }

      const dom = refAppChatBody.value.getElementsByClassName(`mid-${found.id}`)[0]
      if (dom) {
        dom.scrollIntoView()
        setTimeout(() => refAppChatBody.value.scrollTop -= 64)
      }
    }

    const onClickMessageFunction = async ({ type, message }) => {
      if (type === 'reply') {
        store.commit('setChat', { writingReplyTo: message })
        setTimeout(() => {
          if (refAppChatInput.value) refAppChatInput.value.refTextarea.focus()
        })
      }
      if (type === 'reaction') {}
    }

    const onOpenChatContainer = () => nextTick(() => {
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

    watch([
      () => store.getters.windowInnerWidth,
      () => store.getters.windowInnerHeight,
      () => store.getters.settings.chatSizeMax,
    ],
      () => setTimeout(setAppChatPosition),
    )

    onMounted(() => {
      plugins.$bus.$on('first-load-messages', scrollToBottom) // 사실상 이 컴포넌트가 마운트됐을때만 실행되는거라 굳이 이렇게 하고싶진 않지만 별 방법이 없는듯...

      init()
      setAppChatPosition()

      if (typeof Audio === 'undefined') return

      const ding = new Audio(plugins.$helpers.useS3('files/ding.mp3'))
      ding.volume = 0.2
      store.commit('setChat', { ding })
    })

    onUnmounted(() => {
      plugins.$bus.$off('first-load-messages', scrollToBottom)
    })

    return {
      refFoldedIcon,
      refAppChatBody,
      refAppChatInput,
      refAppChat,
      connected,
      messages,
      loadingReplyTarget,
      onClickMessageFunction,
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

  .app-chat-container,
  .app-chat-toggler {
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
    height: 480px;
    max-height: calc(100vh - 16px); // 100vh - 2 * bottom padding
    transition: none;

    @media (max-width: 479px) {
      width: calc(100% - 16px);
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
