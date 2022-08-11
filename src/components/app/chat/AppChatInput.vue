<template>
  <div class="app-chat-input">
    <div
      v-if="$store.getters.chat.writingReplyTo"
      class="writing-reply-to">
      <div class="left">
        <div class="nickname">To: {{ $store.getters.chat.writingReplyTo.profile.nickname }}</div>
        <div class="text lines-1" v-html="$store.getters.chat.writingReplyTo.text"/>
      </div>
      <i
        @click="$store.commit('setChat', { writingReplyTo: null })"
        class="fal fa-times flex-wrap"
      />
    </div>
    <div class="textarea-wrapper">
      <div class="functions">
        <i @click="chatFunctions.image" class="fa fa-image"/>
      </div>
      <textarea
        ref="refTextarea"
        v-model="text"
        @keydown="onKeydown"
        @paste="onPaste"
        :maxlength="120"
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
import { getCurrentInstance, ref, nextTick, onMounted } from 'vue'
import { useStore } from 'vuex'
import useChatHandler from '@/hooks/chat-handler'

export default {
  setup() {
    const { sendWebsocketMessage } = useChatHandler()

    const store = useStore()

    const plugins = getCurrentInstance().appContext.config.globalProperties

    const text = ref(null)

    const refTextarea = ref(null)

    const chatFunctions = {
      image: () => {
        plugins.$modal.custom({
          component: 'ModalSendImage',
          options: {
            noupload: true,
          },
        }).then(url => {
          if (!url) return

          sendTextMessage(url, 'image')
        }).finally(() => {
          setTimeout(() => refTextarea.value.focus())
        })
      },
    }

    const sendTextMessage = (incomingText, type = 'text') => {
      if (!(incomingText || '').trim()) return

      sendWebsocketMessage({
        type,
        text: incomingText,
      })

      text.value = ''

      if (refTextarea.value) nextTick(() => refTextarea.value.focus())
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

    const onPaste = pasteEvent => {
      const items = (pasteEvent.clipboardData || pasteEvent.originalEvent.clipboardData).items
      const img = items[0]
      if (!img.type.includes('image')) return

      const file = img.getAsFile()
      const reader = new FileReader()
      reader.onload = onloadEvent => {
        pasteEvent.target.blur()
        plugins.$modal.custom({
          component: 'ModalSendImage',
          options: {
            file,
            src: onloadEvent.target.result,
          },
        }).then(url => {
          if (!url) return

          sendTextMessage(url, 'image')
        })
      }
      reader.readAsDataURL(file)
    }

    onMounted(() => refTextarea.value.focus())

    return {
      refTextarea,
      text,
      chatFunctions,
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

    textarea {
      padding-right: 16px;
      font-size: 12px;
      line-height: 18px;
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

    &:hover {
      color: var(--brand-primary);
    }
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
    line-height: 16px;
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