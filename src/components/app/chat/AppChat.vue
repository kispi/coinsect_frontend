<template>
  <div class="app-chat" :class="{'folded': $store.getters.chatFolded}">
    <div
      v-if="!$store.getters.chatFolded"
      class="app-chat-container">
      <div class="app-chat-header">
        <div
          @click="toggleChatFolded"
          class="cursor-pointer f-700">
          <span class="c-brand-primary">COINSECT</span>ALK<i class="fa fa-chevron-down m-l-8"/>
        </div>
        <div class="functions">
          <div
            @click="openModalChangeProfile" 
            class="profile">
            <img
              ref="refIconProfileImage"
              :src="profile.image"
              @mouseover="$tooltip.show({
                id: 'tooltipProfileImage',
                text: 'TOOLTIP_PROFILE_IMAGE',
                showAbove: refIconProfileImage,
              })"
              @mouseleave="$tooltip.hide('tooltipProfileImage')">
            <div class="nickname" v-html="profile.nickname"/>
            <i
              @click="messages = []"
              class="fa fa-trash-alt cursor-pointer"
            />
          </div>
        </div>
      </div>
      <div
        ref="refAppChatBody"
        class="app-chat-body no-scrollbar">
        <AppChatMessage
          :message="message"
          :key="message.id"
          v-for="message in messages"
        />
      </div>
      <div class="app-chat-input">
        <input
          ref="refInput"
          v-model="text"
          @keydown="onKeydown"
        />
        <button
          @click="sendTextMessage(text, true)"
          class="btn"
          :disabled="!text">
          SEND
        </button>
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

    const refIconProfileImage = ref(null)

    const refInput = ref(null)

    const text = ref('')

    const {
      refAppChatBody,
      init,
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
      sendWebsocketMessage({
        type: 'text',
        text: incomingText,
      })

      text.value = ''

      if (refInput.value) nextTick(() => refInput.value.focus())
    }

    const toggleChatFolded = () => {
      store.commit('setChatFolded', !store.getters.chatFolded)
      plugins.$helpers.localStorage.setMeta('chatFolded', store.getters.chatFolded)
    }

    watch(
      () => store.getters.chatFolded,
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
      refIconProfileImage,
      refInput,
      refAppChatBody,
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

  .app-chat-container {
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    background: var(--border-base);
    height: 400px;
  }

  .app-chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--app-chat-padding);

    .functions {
      .profile {
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      img {
        width: 24px;
        height: 24px;
        margin-right: 8px;
      }

      .nickname {
        color: var(--brand-primary);
        margin-right: 16px;
        font-weight: 700;
      }

      .fa-trash-alt {
        color: var(--text-light);

        &:hover {
          color: var(--text-stress);
        }
      }
    }
  }

  .app-chat-body {
    overflow-y: auto;
    padding: var(--app-chat-padding);
    flex: 1;
  }

  .app-chat-input {
    display: flex;
    align-items: center;
    padding: calc(var(--app-chat-padding) / 2) var(--app-chat-padding);

    .btn {
      background: none;
      flex: 0 0 auto;

      &:not(:disabled) {
        color: var(--brand-primary);
      }

      &:disabled {
        color: var(--gray-light);
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
    @media (max-width: 767px) {
      right: 0;
      bottom: 0;
      left: 0;
    }

    @media (min-width: 768px) {
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