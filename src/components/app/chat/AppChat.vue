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

    const refInput = ref(null)

    const nickname = ref('') 

    const recommendNickname = () => {
      const nicknameRecommendations = [
        '가즈아', '흑우', '블랙카우', '손절장인', '익항올', '이말올', '이럴거면왜올림', '이럴거면왜내림', '대폰지', '결국폰지사기',
        '오늘도물타기', '물린뒤전망조사', '강제장투', '야미털기', '건전한조정', '코린이', '버거타임', '세력', '타노스빔', '우지한의', '떡락충', '침팬치',
        '메로나', '장대양봉', '스크류바', '장대음봉', '투더문', '기도매매', '우상향', '존버의신', '행복회로불탐', '리또속', '워뇨띠꿈나무', '했제충',
        '무지성롱', '어제청산당함', '청산당할예정', '데드캣', '단타의신', '그새팔았음', '뚝100불남음', '다시는안칠게요', '귀하의포지션이', '방금음전',
        '올해10만불',
      ]

      const randIdx = Math.floor(Math.random() * nicknameRecommendations.length)
      const randNo = Math.floor(Math.random() * 100 + 1)
      nickname.value = `${nicknameRecommendations[randIdx]}${randNo}`.slice(0, 8)
    }

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

      if (refInput.value) nextTick(() => refInput.value.focus())
    }

    const openModalChangeNickname = () => {

    }

    const connect = () => {
      const endpoint = process.env.VUE_APP_API_DOMAIN.replace('http', 'ws')

      connection.value = new WebSocket(`${endpoint}/chat?token=test`)

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

    onMounted(() => {
      recommendNickname()
      connect()
    })

    return {
      refInput,
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
    display: flex;
    flex-direction: column;
    background: var(--border-base);
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
          color: var(--text-stress);
        }
      }
    }
  }

  .app-chat-body {
    height: 240px;
    overflow-y: auto;
    padding: var(--app-chat-padding);
  }

  .app-chat-input {
    display: flex;
    align-items: center;
    padding: calc(var(--app-chat-padding) / 2) var(--app-chat-padding);

    input {
      color: var(--text-stress);
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