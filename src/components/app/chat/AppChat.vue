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
          @click="sendTextMessage(text, true)"
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
import { useStore } from 'vuex'
import AppChatMessage from './AppChatMessage'

export default {
  components: { AppChatMessage },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const refAppChatBody = ref(null)

    const nickname = ref('kispi') 

    const messages = ref([])

    const text = ref('')

    const connection = ref(null)

    const token = ref(null)

    const onKeydown = e => {
      if (e.isComposing) return

      if (e.key === 'Enter') sendTextMessage(text.value, true)
    }

    const addMessage = message => {
      messages.value.push({
        nickname: message.u.n,
        isMine: message.isMine,
        text: message.x,
        timestamp: message.ts,
        type: message.t,
      })

      if (refAppChatBody.value) nextTick(() => refAppChatBody.value.scrollTop = refAppChatBody.value.scrollHeight)
    }

    const sendWebsocketMessage = ({ k, v }) => {
      if (connection.value.readyState !== 1) return

      connection.value.send(JSON.stringify({ k, v }))
    }

    const sendTextMessage = incomingText => {
      sendWebsocketMessage({
        k: 'text',
        v: {
          x: incomingText,
        },
      })
      text.value = ''
    }

    const openModalChangeNickname = () => {

    }

    const connect = () => {
      const endpoint = process.env.VUE_APP_API_DOMAIN.replace('http', 'ws')

      connection.value = new WebSocket(`${endpoint}/chat`)

      connection.value.onopen = () => {
        sendWebsocketMessage({
          k: 'set_nickname',
          v: {
            u: {
              n: nickname.value,
            },
          },
        })
      }

      connection.value.onmessage = event => {
        try {
          const json = JSON.parse(event.data)
          if (json.k === 'auth') token.value = json.v.u.t
          if (json.k === 'text') addMessage(json.v)
          if (json.v && json.v.l) store.commit('setNumActiveUsers', json.v.l)
        } catch (e) {
          console.error(e)
        }
      }

      connection.value.onclose = () => {
        plugins.$toast.error('서버와의 연결이 끊겨 재접속합니다')
        setTimeout(connect, 1000)
      }
    }

    onMounted(connect)

    return {
      refAppChatBody,
      nickname,
      text,
      messages,
      onKeydown,
      openModalChangeNickname,
      sendTextMessage,
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