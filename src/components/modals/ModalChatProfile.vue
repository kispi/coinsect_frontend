<template>
  <div class="modal-chat-profile">
    <ModalHeader :title="$translate('MODAL_CHANGE_CHAT_PROFILE')" @close="$emit('close')"/>
    <div class="body">
      <div class="field-name" v-html="$translate('NICKNAME')"/>
      <input
        ref="refInputNickname"
        placeholder="EX:) 흑우"
        :maxlength="$store.getters.config.maxlength.nickname"
        @keydown.enter="$emit('close', profile)"
        v-model="profile.nickname"
      >
    </div>
    <div class="buttons">
      <div class="flex-row">
        <button
          class="btn btn-default"
          @click="$emit('close')"
          v-html="$translate('CANCEL')"
        />
        <button
          class="btn btn-primary"
          @click="$emit('close', profile)"
          v-html="$translate('CONFIRM')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'

export default {
  props: ['options'],
  setup(props) {
    const refInputNickname = ref(null)

    const profile = ref(props.options.profile)

    onMounted(() => {
      if (refInputNickname.value) refInputNickname.value.focus()
    })

    return {
      refInputNickname,
      profile,
    }
  },
}
</script>

<style lang="scss" scoped>
.modal-chat-profile {
  border-radius: 4px;
  width: 480px;

  .body {
    padding: 16px;

    .field-name {
      font-weight: 700;
      margin-bottom: 8px;
    }
  }

  .buttons {
    margin: 16px 16px 16px auto;
    display: table;

    button {
      padding: 12px 40px;
      text-transform: initial;

      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}
</style>