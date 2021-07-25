<template>
  <div class="app-chat" :class="{'folded': $store.getters.settings.chatFolded}">
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
        <i
          @click="toggleChatFolded"
          class="fa fa-chevron-down"
        />
      </div>
      <div
        ref="refAppChatBody"
        class="app-chat-body no-scrollbar">
        <AppLoading :loading="!connected"/>
        <AppChatMessage
          :message="message"
          :key="message.id"
          v-for="message in messages"
        />
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
import { ref, getCurrentInstance, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import AppChatMessage from './AppChatMessage'
import useChatHandler from '@/hooks/chat-handler'

export default {
  components: { AppChatMessage },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const refInput = ref(null)

    const text = ref('')

    const {
      refAppChatBody,
      init,
      connected,
      setLocalAccount,
      profile,
      messages,
      sendWebsocketMessage,
      scrollToBottom,
    } = useChatHandler()

    const onKeydown = e => {
      if (e.isComposing) return

      if (e.key === 'Enter') sendTextMessage(text.value, true)
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

    watch(
      () => store.getters.settings.chatFolded,
      newVal => {
        if (!newVal) scrollToBottom()
      },
    )

    watch(
      () => Object.keys(store.getters.symbols).length,
      newVal => {
        if (newVal > 0) init()
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
    }
  },
}
</script>

<style lang="scss" scoped>
.app-chat {
  --app-chat-padding: 12px;
  position: fixed;
  bottom: 24px;
  right: 24px;
  transition: none;

  .fa-paper-plane,
  .fa-chevron-down {
    color: var(--text-stress);
    cursor: pointer;

    &:hover {
      color: var(--brand-primary);
    }
  }

  .app-chat-container {
    border-radius: 8px 8px 0 0;
    display: flex;
    flex-direction: column;
    margin: auto;
    background: var(--border-base);
    height: 400px;

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
  }

  .app-chat-body {
    overflow-y: auto;
    padding: var(--app-chat-padding);
    flex: 1;
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
      bottom: 0;
      left: 0;
    }

    @media (min-width: 480px) {
      width: 320px;
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