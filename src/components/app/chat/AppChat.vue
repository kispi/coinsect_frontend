<template>
  <div class="app-chat" :class="{'folded': $store.getters.chatFolded}">
    <div
      v-if="!$store.getters.chatFolded"
      class="app-chat-container">
      <div class="app-chat-header">
        <div
          @click="$store.commit('setChatFolded', true)"
          class="cursor-pointer f-700">
          <span class="c-brand-primary">COINSECT</span>ALK<i class="fa fa-chevron-down m-l-8"/>
        </div>
        <div class="functions">
          <div @click="openModalChangeNickname" class="nickname" v-html="nickname"/>
          <i
            @click="messages = []"
            class="fa fa-trash-alt cursor-pointer"
          />
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
          v-model="text"
          @keydown="onKeydown"
        />
        <button
          @click="sendMessage(text, true)"
          class="btn"
          :disabled="!text">
          SEND
        </button>
      </div>
    </div>
    <div
      v-else
      @click="$store.commit('setChatFolded', false)"
      class="icon-folded">
      <i class="fal fa-comment-dots"/>
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance, onMounted, nextTick } from 'vue'
import AppChatMessage from './AppChatMessage'

export default {
  components: { AppChatMessage },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const refAppChatBody = ref(null)

    const nickname = ref('kispi') 

    const messages = ref([])

    const text = ref('')

    const onKeydown = e => {
      if (e.isComposing) return

      if (e.key === 'Enter') sendMessage(text.value, true)
    }

    const sendMessage = (incomingText, isMine) => {
      messages.value.push({
        nickname: nickname.value,
        type: 'normal',
        text: incomingText,
        isMine: isMine || Math.random() >= 0.5,
        timestamp: plugins.$helpers.dayjs().format('YYYY-MM-DD HH:mm:ss'),
      })

      text.value = ''

      if (refAppChatBody.value) nextTick(() => refAppChatBody.value.scrollTop = refAppChatBody.value.scrollHeight)
    }

    const openModalChangeNickname = () => {

    }

    onMounted(() => {
      sendMessage('테스트 메시지1')
      sendMessage('숏일까 롱일까?')
      sendMessage('매우 매우 매우 매우 매우 매우 매우 매우 매우 매우 매우 매우 매우 매우 매우 긴 메시지')
      sendMessage('모르겠다 ㄹㅇ')
      sendMessage('채팅서버를 준비하면 실제 채팅이 가능하지만 일단 UI부터 만들었다')
      sendMessage('ㅋㅋㅋㅋㅋ')
    })

    return {
      refAppChatBody,
      nickname,
      text,
      messages,
      onKeydown,
      openModalChangeNickname,
      sendMessage,
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

  .app-chat-container {
    border-radius: 8px;
    border: 1px solid var(--border-base);
    box-shadow: 0 2px 8px var(--border-base);
    display: flex;
    flex-direction: column;
    background: var(--background-base);
  }

  .app-chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--app-chat-padding);

    .functions {
      display: flex;
      align-items: center;

      .nickname {
        color: var(--brand-primary);
        cursor: pointer;
        text-decoration: underline;
        margin-right: 16px;
      }

      .fa-trash-alt {
        color: var(--text-light);

        &:hover {
          color: var(--text-dark);
        }
      }
    }
  }

  .app-chat-body {
    height: 240px;
    overflow-y: auto;
    padding: 0 var(--app-chat-padding);
    border-top: 1px solid var(--border-base);
    border-bottom: 1px solid var(--border-base);
  }

  .app-chat-input {
    display: flex;
    align-items: center;
    padding: calc(var(--app-chat-padding) / 2) var(--app-chat-padding);

    input {
      background: rgba(255, 255, 255, 0.1);
    }

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
</style>