<template>
  <div class="app-chat-header">
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
    <div
      v-if="$store.getters.chatUser"
      class="profile">
      <AppImg
        v-if="$store.getters.chatUser.profile.image"
        :src="$store.getters.chatUser.profile.image"
        @click="$modal.custom({ component: 'ModalChatSettings' })"
      />
      <div class="flex-row items-center">
        <div
          class="nickname lines-1"
          :class="{
            'c-price-up-bybit': (($store.getters.chatUser.profile || {}).sentiment || {}).type === 'long',
            'c-price-down-bybit': (($store.getters.chatUser.profile || {}).sentiment || {}).type === 'short',
          }"
          @click="$modal.custom({ component: 'ModalChatSettings' })"
          v-html="$store.getters.chatUser.profile.nickname"
        />
        <BadgeToken :token="$store.getters.chatUser.token" class="m-l-4"/>
      </div>
    </div>
    <div class="chat-settings">
      <div
        class="clickable-icon-wrapper chat-folded"
        @click="toggleChatFolded">
        <i class="fal fa-minus"/>
      </div>
      <div
        class="clickable-icon-wrapper chat-size"
        @click="$store.commit('setSettings', { chatSizeMax: !$store.getters.settings.chatSizeMax })">
        <i class="fal" :class="$store.getters.settings.chatSizeMax ? 'fa-clone' : 'fa-square'"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    toggleChatFolded: Function,
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