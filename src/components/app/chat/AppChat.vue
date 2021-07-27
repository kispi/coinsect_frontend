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
          <AppImg :src="profile.image"/>
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
        <AppLoading :loading="!connected"/>
        <AppChatMessage
          :message="message"
          :key="message.id"
          v-for="message in messages"
        />
        <div
          @click="scrollToBottom(true)"
          class="clickable-icon-wrapper scroll-to-bottom"
          :class="{'o-0 no-touch': autoScrollable}">
          <i class="fa fa-chevron-down"/>
        </div>
      </div>
      <div class="app-chat-input">
        <div class="input-wrapper">
          <input
            ref="refInput"
            v-model="text"
            @keydown="onKeydown"
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
      @click="toggleChatFolded"
      class="icon-folded">
      <i class="fal fa-comment-dots"/>
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance, nextTick, watch, computed } from 'vue'
import { useStore } from 'vuex'
import AppChatMessage from './AppChatMessage'
import useChatHandler from '@/hooks/chat-handler'

export default {
  components: { AppChatMessage },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const refInput = ref(null)

    const refAppChatBody = ref(null)

    const text = ref('')

    const {
      init,
      connected,
      setLocalAccount,
      profile,
      messages,
      sendWebsocketMessage,
    } = useChatHandler()

    const onKeydown = e => {
      setTimeout(() => {
        text.value = e.target.value
        if (e.key === 'Enter') sendTextMessage(text.value, true)
      })
    }

    const openModalChangeProfile = () => {
      plugins.$modal.custom({
        component: 'ModalChatProfile',
        options: {
          profile: {
            nickname: profile.value.nickname,
            image: profile.value.image,
          },
        },
      }).then(result => {
        if (result) profile.value = result

        setLocalAccount()
      })
    }

    const sendTextMessage = incomingText => {
      if (!incomingText) return

      sendWebsocketMessage({
        type: 'text',
        text: incomingText,
      })

      text.value = ''

      if (refInput.value) nextTick(() => refInput.value.focus())
    }

    const toggleChatFolded = () => {
      store.commit('setSettings', { chatFolded: !store.getters.settings.chatFolded })
    }

    const toggleChatSizeMax = () => {
      store.commit('setSettings', { chatSizeMax: !store.getters.settings.chatSizeMax })
    }

    const autoScrollable = ref(true)

    const onScroll = e => {
      const dom = e.target
      autoScrollable.value = dom.scrollHeight <= dom.scrollTop + dom.clientHeight + 80
    }

    const scrollToBottom = force => {
      const dom = refAppChatBody.value
      if (!dom) return

      if (!force && !autoScrollable.value) return

      nextTick(() => dom.scrollTop = dom.scrollHeight)
    }

    watch(
      () => Object.keys(store.getters.symbols).length,
      newVal => {
        if (newVal > 0) init()
      },
    )

    watch(
      () => messages.value.length,
      () => {
        scrollToBottom()
      },
    )

    return {
      refInput,
      refAppChatBody,
      connected,
      profile,
      text,
      messages,
      onKeydown,
      openModalChangeProfile,
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
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    margin: auto;
    background: var(--border-base);
    height: 400px;
    transition: none;

    @media (max-width: 479px) {
      width: calc(100% - 32px);
    }
  }

  .app-chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--app-chat-padding);

    .profile {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .app-img {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }

    .nickname {
      color: var(--text-stress);
      margin-right: 16px;
      font-weight: 700;

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
        // transform: rotate(180deg);

        &:not(:first-child) {
          margin-left: 8px;
        }
      }
    }
  }

  .app-chat-body {
    overflow-y: auto;
    padding: var(--app-chat-padding);
    flex: 1;

    .scroll-to-bottom {
      position: absolute;
      right: 8px;
      bottom: 64px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--background-base);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.24);
      transition: all 0.2s ease;
    }
  }

  .app-chat-input {
    padding: calc(var(--app-chat-padding) / 2) var(--app-chat-padding);

    .input-wrapper {
      border-radius: 24px;
      background: var(--background-light);
      width: 100%;
      display: flex;
      align-items: center;
      padding: 8px 16px;

      input {
        padding-right: 16px;
      }

      .fa-paper-plane {
        font-size: 16px;
        cursor: pointer;
      }
    }
  }

  .icon-folded {
    cursor: pointer;
    padding: 12px;
    background: var(--brand-primary);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.24);
    border-radius: 50%;
    overflow: hidden;

    .fa-comment-dots {
      font-size: 32px;
      color: var(--white);
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
      top: 8px;

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
      border: 1px solid var(--gray-light);

      .app-chat-body {
        border-top: 1px solid var(--border-base);
        border-bottom: 1px solid var(--border-base);
      }
    }
  }

  &.dark {
    .app-chat-container {
      background: var(--black-light);
      border: 1px solid var(--gray);

      .app-chat-body {
        border-top: 1px solid var(--gray-dark);
        border-bottom: 1px solid var(--gray-dark);
      }
    }
  }
}
</style>