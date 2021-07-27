<template>
  <div class="modal-chat-profile">
    <ModalHeader :title="$translate('MODAL_CHANGE_CHAT_PROFILE')" @close="$emit('close')"/>
    <div class="body">
      <div class="field-name profile-image">
        <div>{{ $translate('PROFILE_IMAGE') }}</div>
        <AppImg
          v-if="profile.image"
          :src="profile.image"
        />
      </div>
      <div class="crypto-icons">
        <div class="grid">
          <div
            class="img-container"
            :key="symbol"
            v-for="symbol in Object.keys($store.getters.symbols)">
            <AppImg
              @click="profile.image = `https://static.upbit.com/logos/${symbol}.png`"
              :class="{'selected': (profile.image || '').endsWith(`${symbol}.png`)}"
              class="overlay"
              :src="`https://static.upbit.com/logos/${symbol}.png`"
            />
          </div>
        </div>
      </div>
      <div class="field-name" v-html="$translate('NICKNAME')"/>
      <input
        ref="refInputNickname"
        placeholder="EX:) 흑우"
        maxlength="12"
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

    .profile-image {
      display: flex;
      align-items: center;

      .app-img {
        width: 16px;
        margin-left: 8px;
      }
    }

    .crypto-icons {
      background: var(--white);
      padding: 16px;
      margin-bottom: 40px;
      border-radius: 4px;

      .grid {
        display: grid;
        grid-template-columns: repeat(16, 1fr);
        grid-gap: 8px;
      }

      .img-container {
        padding-top: 100%;
        width: 100%;
        position: relative;

        .app-img {
          cursor: pointer;

          &.selected {
            border: 2px solid var(--danger);
          }
        }
      }

      @media (max-width: 767px) {
        max-height: 240px;
        overflow-y: auto;

        .grid {
          grid-template-columns: repeat(12, 1fr);
        }
      }
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