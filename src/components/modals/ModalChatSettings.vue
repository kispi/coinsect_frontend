<template>
  <div class="modal-chat-settings">
    <ModalHeader :title="$translate('MODAL_CHAT_SETTINGS')" @close="$emit('close')"/>
    <div class="body">
      <div class="section">
        <div class="profile">
          <div class="image-container">
            <i
              v-if="profile.image"
              @click="image.delete"
              class="fal fa-times center"
            />
            <AppImg
              :src="profile.image || require('@/assets/images/no-image-person.png')"
              @click="profile.image ? $modal.images({
                images: [profile.image],
              }) : image.upload()"
            />
          </div>
          <div
            class="input-wrapper"
            :class="{'editing': editing}">
            <input
              ref="refInputNickname"
              :placeholder="`최대 ${$store.getters.config.maxlength.nickname} 글자`"
              :maxlength="$store.getters.config.maxlength.nickname"
              :readonly="!editing"
              @keydown.enter="toggleEditProfile"
              @keydown="e => onKeydown(e, 'nickname')"
              v-model="profile.nickname"
            >
            <i @click="toggleEditProfile" class="fal" :class="editing ? 'fa-save' : 'fa-edit'"/>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="title">* 채팅</div>
        <div class="chat-setting-item">
          <div class="field-name">{{ $translate('CHAT_TRANSPARENT') }}</div>
          <AppToggler
            ref="refChatTransparent"
            :modelValue="$store.getters.settings.chatTransparent"
            @click="$store.commit('setSettings', { chatTransparent: !$store.getters.settings.chatTransparent })"
            @mouseover="$tooltip.show({
              id: 'tooltipChatTransparent',
              showAbove: refChatTransparent.$el,
              text: 'TOOLTIP_CHAT_TRANSPARENT',
            })"
            @mouseleave="$tooltip.hide('tooltipChatTransparent')"
          />
        </div>
        <div class="chat-setting-item">
          <div class="field-name">{{ $translate('CHAT_DING') }}</div>
          <AppToggler
            ref="refChatDing"
            :modelValue="$store.getters.settings.chatDing"
            @click="$store.commit('setSettings', { chatDing: !$store.getters.settings.chatDing })"
            @mouseover="$tooltip.show({
              id: 'tooltipChatDing',
              showAbove: refChatDing.$el,
              text: 'TOOLTIP_CHAT_DING',
            })"
            @mouseleave="$tooltip.hide('tooltipChatDing')"
          />
        </div>
        <div class="chat-setting-item">
          <div class="field-name">{{ $translate('CHAT_OVERLAY_NEW_MESSAGE') }}</div>
          <AppToggler
            ref="refChatOverlayNewMessage"
            :modelValue="$store.getters.settings.chatOverlayNewMessage"
            @click="$store.commit('setSettings', { chatOverlayNewMessage: !$store.getters.settings.chatOverlayNewMessage })"
            @mouseover="$tooltip.show({
              id: 'tooltipChatOverlayNewMessage',
              showAbove: refChatOverlayNewMessage.$el,
              text: 'TOOLTIP_CHAT_OVERLAY_NEW_MESSAGE',
            })"
            @mouseleave="$tooltip.hide('tooltipChatOverlayNewMessage')"
          />
        </div>
        <div class="chat-setting-item">
          <div class="field-name">{{ $translate('CHAT_HIDE_IMAGE') }}</div>
          <AppToggler
            ref="refChatHideImage"
            :modelValue="$store.getters.settings.chatHideImage"
            @click="$store.commit('setSettings', { chatHideImage: !$store.getters.settings.chatHideImage })"
            @mouseover="$tooltip.show({
              id: 'tooltipChatHideImage',
              showAbove: refChatHideImage.$el,
              text: 'TOOLTIP_CHAT_HIDE_IMAGE',
            })"
            @mouseleave="$tooltip.hide('tooltipChatHideImage')"
          />
        </div>
        <div class="chat-setting-item">
          <div class="field-name">{{ $translate('CHAT_SIZE_MAX') }}</div>
          <AppToggler
            ref="refChatSizeMax"
            :modelValue="$store.getters.settings.chatSizeMax"
            @click="$store.commit('setSettings', { chatSizeMax: !$store.getters.settings.chatSizeMax })"
            @mouseover="$tooltip.show({
              id: 'tooltipChatSizeMax',
              showAbove: refChatSizeMax.$el,
              text: 'TOOLTIP_CHAT_SIZE_MAX',
            })"
            @mouseleave="$tooltip.hide('tooltipChatSizeMax')"
          />
        </div>
      </div>
      <div class="section">
        <div class="title">* 푸시알림</div>
        <div class="chat-setting-item">
          <div class="field-name">{{ $translate('PUSH_POSITION_CHANGE') }}</div>
          <AppToggler
            :modelValue="$store.getters.chatUserSetting.pushPositionChange"
            @click="togglePushPositionChange"
          />
        </div>
        <!-- pushChatNewMessage <- 얘도 나중에 넣을까? 과하려나? -->
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue'
import { useStore } from 'vuex'
import useChatHandler from '@/hooks/chat-handler'
import usePWA from '@/hooks/addons/pwa'

export default {
  props: ['options'],
  setup() {
    const refChatDing = ref(null)

    const refChatTransparent = ref(null)

    const refChatSizeMax = ref(null)

    const refChatOverlayNewMessage = ref(null)

    const refChatHideImage = ref(null)

    const refInputNickname = ref(null)

    const { setAccount, updateUserSetting } = useChatHandler()

    const { initFirebase } = usePWA()

    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const editing = ref(null)

    const profile = ref({
      nickname: store.getters.chatUser.profile.nickname,
      image: store.getters.chatUser.profile.image,
      sentiment: store.getters.chatUser.profile.sentiment || {},
    })

    const onKeydown = (e, field) => {
      setTimeout(() => {
        profile.value[field] = e.target.value
      })
    }

    const image = {
      upload: () => {
        plugins.$modal.custom({
          component: 'ModalImageUploader',
          options: {
            path: 'chat/profile',
          },
        }).then(result => {
          if (!result) return

          if (result.url) profile.value.image = result.url
          update()
        })
      },
      delete: () => {
        plugins.$modal.confirm({
          body: plugins.$translate('MODAL_CONFIRM_DELETE_IMAGE'),
        }).then(idx => {
          if (idx === 1) {
            profile.value.image = null
            update()
          }
        })
      },
    }

    const update = async () => {
      try {
        await setAccount(profile.value)
        editing.value = false
      } catch (e) {
        plugins.$toast.error(e.data.message)

        if (!(profile.value.nickname || '').trim()) {
          refInputNickname.value.focus()
        }
      }
    }

    const toggleEditProfile = async () => {
      if (!editing.value) {
        refInputNickname.value.select()
        editing.value = true
        return
      }

      update()
    }

    const togglePushPositionChange = async () => {
      try {
        const p = store.getters.chatUserSetting
        if (!p.pushPositionChange) {
          const result = await plugins.$modal.confirm({
            body: '브라우저에서 푸시 알림을 보낼 수 있도록 물어보는 창이 뜨면 허용해주세요<br>거절했더라도 나중에 브라우저 설정에서 다시 허용할 수 있습니다 🥰',
          })
          if (!result) return

          p.deviceToken = await initFirebase()
        }
        p.pushPositionChange = !p.pushPositionChange
        updateUserSetting()
      } catch (e) {
        plugins.$toast.error('푸시 알림이 거부되어 있어요 😢<br>사이트 설정에서 허용해주세요')
      }
    }

    return {
      refChatDing,
      refChatTransparent,
      refChatSizeMax,
      refChatOverlayNewMessage,
      refChatHideImage,
      refInputNickname,
      editing,
      profile,
      image,
      onKeydown,
      toggleEditProfile,
      togglePushPositionChange,
    }
  },
}
</script>

<style lang="scss" scoped>
.modal-chat-settings {
  border-radius: 4px;
  width: 360px;

  .body {
    padding: 16px;

    .chat-setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &:not(:last-child) {
        margin-bottom: 16px;
      }

      .field-name {
        width: 120px;
        flex: 0 0 auto;
        color: var(--text-stress);
      }

      input {
        height: 24px;
        padding: 0 8px;
      }
    }

    .section {
      padding: 24px 0;

      .title {
        font-size: 18px;
        margin-bottom: 16px;
        color: var(--text-stress);
      }

      &:not(:last-child) {
        border-bottom: 1px solid var(--border-base);
      }
    }
  }

  .profile {
    i {
      cursor: pointer;

      &:hover {
        color: var(--brand-primary);
      }
    }

    .image-container {
      width: 96px;
      height: 96px;
      margin: 0 auto 16px;
      position: relative;
      border-radius: 50%;
      cursor: pointer;

      .fa-times {
        width: 24px;
        height: 24px;
        background: rgba(255, 255, 255, 0.8);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.24);
        color: var(--black);
        border-radius: 50%;
        position: absolute;
        top: 0px;
        right: 0px;
      }

      .app-img {
        border-radius: 50%;
      }
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      border: 0;
      width: 160px;
      margin: 0 auto;
      position: relative;
      border-bottom: 1px solid transparent;

      input {
        padding: 4px;
        margin-right: 8px;
        text-align: center;
      }

      &.editing {
        border-bottom: 1px solid var(--border-base);
      }

      i {
        position: absolute;
        right: 0;
      }
    }
  }

  .btn-primary {
    padding: 12px 40px;
    display: table;
    margin: 24px auto;
  }
}
</style>