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
      <div class="app-chat-header">
        <div
          v-if="$store.getters.me"
          @click="openModalChangeProfile"
          class="profile">
          <div class="nickname" v-html="$store.getters.me.profile.nickname"/>
          <BadgeToken :token="$store.getters.me.token"/>
        </div>
        <div class="chat-settings">
          <div
            class="clickable-icon-wrapper"
            @click="$store.commit('setSettings', { chatTransparent: !$store.getters.settings.chatTransparent })">
            <i class="fal" :class="$store.getters.settings.chatTransparent ? 'fa-eye' : 'fa-eye-slash'"/>
          </div>
          <div
            class="clickable-icon-wrapper"
            @click="$store.commit('setSettings', { chatDing: !$store.getters.settings.chatDing })">
            <i class="fal" :class="$store.getters.settings.chatDing ? 'fa-bell' : 'fa-bell-slash'"/>
          </div>
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
        <div class="num-users f-mono">
          <i class="fas fa-user-friends"/>{{ ($store.getters.numActiveUsers || 0).toLocaleString() }}
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
            @keydown.prevent.enter
            :maxlength="(($store.getters.config || {}).maxlength || {}).message"
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
import BadgeToken from './BadgeToken'
import DailySeparator from './DailySeparator'
import useChatHandler from '@/hooks/chat-handler'
import useModalDraggable from '@/hooks/modal-draggable'

export default {
  components: {
    AppChatMessage,
    BadgeToken,
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
      }).then(result => {
        if (result) {
          result.nickname = (result.nickname || '').slice(0, store.getters.config.maxlength.nickname)
          setAccount(result)
        }

        setTimeout(() => refTextarea.value.focus()) // 바로하면 textarea에서 엔터까지 쳐짐
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

    const ding = new Audio(plugins.$helpers.useS3('files/ding.mp3'))
    ding.volume = 0.2

    const onIncomingMessage = () => {
      if (store.getters.settings.chatFolded) {
        plugins.$helpers.animate.shake(refFoldedIcon.value)
        if (ding && store.getters.settings.chatDing) ding.play()
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

    watch(
      () => store.getters.settings.chatFolded,
      (newVal, oldVal) => {
        if (!newVal && oldVal) nextTick(() => {
          refTextarea.value.focus()
          scrollToBottom()
          setAppChatPosition()
        })
      },
    )

    watch(
      () => numUnreads.value,
      newVal => {
        if (newVal > 0) {
          plugins.$helpers.localStorage.setMeta('numUnreads', newVal)
        }
      },
    )

    watch(
      () => store.getters.windowInnerWidth,
      setAppChatPosition,
    )

    onMounted(() => {
      storedUnreads.value = plugins.$helpers.localStorage.getMeta('numUnreads')

      plugins.$bus.$on('incoming-message', onIncomingMessage)
      plugins.$bus.$on('first-load-messages', scrollToBottom) // 사실상 이 컴포넌트가 마운트됐을때만 실행되는거라 굳이 이렇게 하고싶진 않지만 별 방법이 없는듯...

      init()
      setAppChatPosition()
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
    cursor: grab;

    .profile {
      display: flex;
      align-items: baseline;

      .nickname {
        color: var(--text-stress);
        margin-right: 8px;
        font-weight: 700;
        text-decoration: underline;
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

    .num-users {
      position: absolute;
      text-align: right;
      top: calc(48px + 1px);
      color: var(--price-up);
      left: 0;
      right: 0;
      padding: 8px;
      font-size: 12px;
      font-weight: 700;

      .fa-user-friends {
        margin-right: 4px;
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
    right: 8px;
    bottom: 8px;
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

      .num-users {
        background: linear-gradient(to bottom, var(--gs-e0), transparent);
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

      .num-users {
        background: linear-gradient(to bottom, var(--gs-22), transparent);
      }
    }
  }
}
</style>