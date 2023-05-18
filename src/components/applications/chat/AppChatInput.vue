<template>
  <div class="app-chat-input">
    <div
      v-if="$store.getters.chat.writingReplyTo"
      class="writing-reply-to">
      <div class="left">
        <div class="nickname">To: {{ $store.getters.chat.writingReplyTo.user.profile.nickname }}</div>
        <div class="text lines-1" v-html="$store.getters.chat.writingReplyTo.text"/>
      </div>
      <i
        @click="$store.commit('setChat', { writingReplyTo: null })"
        class="fal fa-times flex-wrap"
      />
    </div>
    <div class="textarea-wrapper">
      <div
        v-if="!$store.getters.settings.sentimentVoted"
        class="vote-long-short overlay">
        <AppImg :src="$helpers.withCdn('images/influencers/zzapgu_monkey.png')"/>
        <div class="buttons">
          <button
            @click="updateSentiment('long', true)"
            class="btn btn-long">
            {{ $translate('LONG') }}
          </button>
          <button
            @click="updateSentiment('short', true)"
            class="btn btn-short">
            {{ $translate('SHORT') }}
          </button>
        </div>
        <div class="m-t-24">
          - 방문자님의 관점을 알기 위함입니다<br>
          - 클릭 후 24시간동안은 물어보지 않습니다
        </div>
      </div>
      <div class="functions">
        <i @click="chatFunctions.image" class="fa fa-image"/>
      </div>
      <textarea
        ref="refTextarea"
        v-model="text"
        @keydown="onKeydown"
        @paste="onPaste"
        :disabled="!$store.getters.settings.sentimentVoted"
        :maxlength="255"
        placeholder="이미지를 첨부하려면 왼쪽 아이콘 클릭 / 또는 스크린샷 후 Ctrl + V"
        class="no-scrollbar"
      />
      <i
        v-if="text"
        @click="sendTextMessage(text)"
        class="fa fa-paper-plane"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import useChatHandler from '@/hooks/chat-handler'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { sendWebsocketMessage, updateSentiment } = useChatHandler()

    const { plugins, store } = useGlobalHooks()

    const text = ref(null)

    const refTextarea = ref(null)

    const focusOnInput = () => {
      setTimeout(() => {
        if (refTextarea.value) refTextarea.value.focus()
      })
    }

    const chatFunctions = {
      image: () => {
        plugins.$modal.custom({
          component: 'ModalUploadImage',
          options: {
            noupload: true,
          },
        }).then(url => {
          if (!url) return

          sendTextMessage(url, 'image')
        }).finally(focusOnInput)
      },
    }

    const sendTextMessage = (incomingText, type = 'text') => {
      if (!(incomingText || '').trim()) return

      sendWebsocketMessage({
        type,
        text: incomingText,
      })

      text.value = ''

      focusOnInput()
    }

    const onKeydown = e => {
      if (e.key === 'Enter') {
        if (!text.value || e.isComposing) return

        if (e.shiftKey || store.getters.isMobile) {
          // 커서가 채팅창의 마지막줄에 있을때만 textarea를 끝까지 스크롤함
          if (e.target.value.length - e.target.selectionStart <= 1) refTextarea.value.scrollTop = refTextarea.value.scrollHeight
          return
        }

        e.preventDefault()
        sendTextMessage(text.value)
      }

      setTimeout(() => {
        text.value = e.target.value
      })
    }

    const onPaste = e => {
      plugins.$helpers.logic.onPasteClipboardImage(
        e,
        url => {
          if (!url) return

          sendTextMessage(url, 'image')
        },
      )
    }

    onMounted(focusOnInput)

    return {
      refTextarea,
      text,
      chatFunctions,
      updateSentiment,
      sendTextMessage,
      onKeydown,
      onPaste,
    }
  }
}
</script>

<style lang="scss" scoped>
.app-chat-input {
  padding: calc(var(--app-chat-padding) / 2) var(--app-chat-padding);

  .textarea-wrapper {
    border-radius: 4px;
    background: var(--background-light);
    width: 100%;
    display: flex;
    align-items: center;
    padding: 8px;

    .vote-long-short {
      color: var(--text-stress);
      padding: 4px 12px;
      border: 1px solid var(--border-base);
      background: var(--brand-primary-hover-bg);
      backdrop-filter: blur(4px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1;
      top: 45px;
      font-size: 12px;
      text-align: center;

      .app-img {
        border-radius: 50%;
        width: 120px;
        height: 120px;
      }

      .buttons {
        margin-top: 24px;
        display: flex;
        gap: 8px;
        width: 100%;

        button {
          width: 100%;
          font-size: 16px;
          border-radius: 4px;

          &:hover {
            opacity: 0.5;
          }
        }

        .btn-long {
          background: var(--price-up-bybit);
        }

        .btn-short {
          background: var(--price-down-bybit);
        }
      }
    }

    textarea {
      padding-right: 16px;
      font-size: 12px;
      height: 44px;
    }

    .fa-paper-plane {
      font-size: 16px;
      cursor: pointer;
    }
  }

  .fa-image {
    margin-right: 8px;
    cursor: pointer;
  }

  .functions {
    border-right: 1px solid var(--border-base);
    margin: -8px 0;
    padding: 8px 0;
    margin-right: 8px;
  }

  .writing-reply-to {
    background: var(--background-base);
    border: 1px solid var(--border-base);
    margin-bottom: 8px;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 12px;
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 76px;
    right: var(--app-chat-padding);
    left: var(--app-chat-padding);
    z-index: 1;

    .left {
      min-width: 0;
      margin-right: 8px;
      flex: 1 1 0;

      .nickname {
        margin-bottom: 4px;
        color: var(--text-stress);
      }
    }

    .fa-times {
      font-size: 14px;
      color: var(--text-stress);
      cursor: pointer;

      &:hover {
        color: var(--brand-primary);
      }
    }
  }
}
</style>