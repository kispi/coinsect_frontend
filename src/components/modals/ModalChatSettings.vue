<template>
  <div class="modal-chat-profile">
    <ModalHeader :title="$translate('MODAL_CHAT_SETTINGS')" @close="$emit('close')"/>
    <div class="body">
      <div class="section">
        <div class="title">{{ $translate('SETTING_CHAT_GENERAL') }}</div>
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
        <div class="title">{{ $translate('SETTING_CHAT_PROFILE') }}</div>
        <div class="chat-setting-item">
          <div class="field-name" v-html="$translate('NICKNAME')"/>
          <input
            ref="refInputNickname"
            :placeholder="`최대 ${$store.getters.config.maxlength.nickname} 글자`"
            :maxlength="$store.getters.config.maxlength.nickname"
            @keydown.enter="onConfirm"
            @keydown="e => onKeydown(e, 'nickname')"
            v-model="profile.nickname"
          >
        </div>
        <div class="chat-setting-item">
          <div class="field-name">{{ $translate('PROFILE_IMAGE_URL') }}</div>
          <input
            :placeholder="'https://static.upbit.com/logos/BTC.png'"
            @keydown.enter="onConfirm"
            @keydown="e => onKeydown(e, 'image')"
            v-model="profile.image"
          >
        </div>
      </div>
    </div>
    <button
      @click="onConfirm"
      class="btn btn-primary"
      v-html="$translate('CONFIRM')"
    />
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  props: ['options'],
  setup(props, { emit }) {
    const refChatDing = ref(null)

    const refChatTransparent = ref(null)

    const refChatSizeMax = ref(null)

    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const refInputNickname = ref(null)

    const profile = ref({
      nickname: store.getters.me.profile.nickname,
      image: store.getters.me.profile.image,
    })

    const onConfirm = async () => {
      if (!profile.value) return

      profile.value.nickname = (profile.value.nickname || '').slice(0, store.getters.config.maxlength.nickname)
      profile.value.image = (profile.value.image || '').trim()

      try {
        store.commit('setMe', await props.options.setAccount(profile.value))
        plugins.$toast.success('닉네임과 이미지를 설정했습니다.')
        emit('close')
      } catch (e) {
        plugins.$toast.error(e.data.message)
      }
    }

    const onKeydown = (e, field) => {
      setTimeout(() => {
        profile.value[field] = e.target.value
      })
    }

    onMounted(() => {
      if (refInputNickname.value) refInputNickname.value.focus()
    })

    return {
      refChatDing,
      refChatTransparent,
      refChatSizeMax,
      refInputNickname,
      profile,
      onKeydown,
      onConfirm,
    }
  },
}
</script>

<style lang="scss" scoped>
.modal-chat-profile {
  border-radius: 4px;
  width: 360px;

  .body {
    padding: 16px;

    .chat-setting-item {
      padding-left: 8px;
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
      .title {
        font-size: 18px;
        margin-bottom: 16px;
        color: var(--text-stress);
      }

      &:not(:last-child) {
        margin-bottom: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid var(--border-base);
      }
    }
  }

  button {
    padding: 12px 40px;
    display: table;
    margin: 24px auto;
  }
}
</style>