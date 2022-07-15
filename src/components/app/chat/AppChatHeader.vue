<template>
  <div class="app-chat-header">
    <div class="chat-settings left">
      <div
        class="clickable-icon-wrapper chat-folded"
        @click="toggleChatFolded">
        <i class="fa fa-times"/>
      </div>
      <div
        class="clickable-icon-wrapper chat-size"
        @click="$store.commit('setSettings', { chatSizeMax: !$store.getters.settings.chatSizeMax })">
        <i class="fa" :class="$store.getters.settings.chatSizeMax ? 'fa-down-left-and-up-right-to-center' : 'fa-arrow-up-right-and-arrow-down-left-from-center'"/>
      </div>
    </div>
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
        @click="$store.commit('setSettings', { chatDing: !$store.getters.settings.chatDing })">
        <i class="fal" :class="$store.getters.settings.chatDing ? 'fa-bell' : 'fa-bell-slash'"/>
      </div>
      <div
        class="clickable-icon-wrapper"
        @click="$store.commit('setSettings', { chatTransparent: !$store.getters.settings.chatTransparent })">
        <i class="fal" :class="$store.getters.settings.chatTransparent ? 'fa-eye' : 'fa-eye-slash'"/>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue'
import useChatHandler from '@/hooks/chat-handler'

export default {
  props: {
    toggleChatFolded: Function,
  },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const { setAccount } = useChatHandler()

    const openModalChatSettings = () => {
      plugins.$modal.custom({
        component: 'ModalChatSettings',
        options: {
          setAccount,
        },
      })
    }

    return {
      openModalChatSettings,
    }
  },
}
</script>

<style lang="scss" scoped>
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

    &.left {
      .clickable-icon-wrapper {
        border-radius: 50%;
        width: 14px;
        height: 14px;

        i {
          font-size: 16px;
          color: var(--black);
          transform: scale(0.5) rotate(90deg);
        }

        &:not(:hover) {
          i {
            display: none;
          }
        }
      }
    }

    .chat-folded {
      background: #F26053;
    }

    .chat-size {
      background: #4EBC4B;
    }
  }
}
</style>