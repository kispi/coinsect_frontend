<template>
  <div class="app-chat-header">
    <div class="chat-settings">
      <div
        class="clickable-icon-wrapper"
        @click="$modal.custom({ component: 'ModalChatSettings' })">
        <i class="fal fa-cog"/>
      </div>
    </div>
    <div
      v-if="$store.getters.chatUser"
      class="profile">
      <UserSymbol :user="$store.getters.me" class="m-r-4"/>
      <div class="flex-row items-center">
        <div
          class="nickname lines-1"
          :class="{
            'c-price-up-bybit': $store.getters.chatUser.profile.sentiment.type === 'long',
            'c-price-down-bybit': $store.getters.chatUser.profile.sentiment.type === 'short',
          }"
          @click="$modal.custom({ component: 'ModalChatSettings' })"
          v-html="$store.getters.chatUser.profile.nickname"
        />
        <BadgeToken v-if="!$store.getters.me" :token="$store.getters.chatUser.token" class="m-l-4"/>
      </div>
    </div>
    <div class="chat-settings">
      <div
        class="clickable-icon-wrapper chat-folded"
        @click="$store.commit('setSettings', { chatFolded: true })">
        <i class="fal fa-minus"/>
      </div>
      <div
        class="clickable-icon-wrapper chat-size"
        @click="toggleChatSizeMax">
        <i class="fal" :class="$store.getters.settings.chatSizeMax ? 'fa-clone' : 'fa-square'"/>
      </div>
    </div>
  </div>
</template>

<script>
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { store } = useGlobalHooks()

    const toggleChatSizeMax = () => {
      const appChatContainer = document.querySelector('.app-chat-container')
      if (appChatContainer) appChatContainer.style.height = ''
      store.commit('setSettings', { chatSizeMax: !store.getters.settings.chatSizeMax })
    }

    return {
      toggleChatSizeMax,
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
  position: relative;
  cursor: grab;

  .profile {
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .nickname {
      color: var(--text-stress);
      font-weight: 700;
      font-size: 12px;
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
      width: 20px;
      height: 20px;

      i {
        font-size: 12px;
      }

      &:not(:first-child) {
        margin-left: 8px;
      }
    }
  }
}
</style>