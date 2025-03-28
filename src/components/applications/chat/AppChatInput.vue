<template>
  <div class="app-chat-input">
    <EmojiPicker v-if="showEmojis" @pick="onPickEmoji" @close="showEmojis = false"/>
    <div
      v-if="store.getters.chat.writingReplyTo"
      class="writing-reply-to">
      <div class="left">
        <div class="nickname o-50">To: {{ store.getters.chat.writingReplyTo.user.profile.nickname }}</div>
        <div class="text c-text-stress lines-1" v-html="store.getters.chat.writingReplyTo.text"/>
      </div>
      <div
        @click="store.commit('setChat', { writingReplyTo: null })"
        class="clickable-icon-wrapper">
        <i class="fal fa-times"/>
      </div>
    </div>
    <div class="textarea-wrapper">
      <div class="functions">
        <i @click="chatFunctions.image" class="fa fa-image"/>
        <IconAddEmoji @click="showEmojis = !showEmojis"/>
      </div>
      <textarea
        ref="refTextarea"
        v-model="text"
        @keydown="onKeydown"
        @paste="onPaste"
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

<script setup>
import { ref, onMounted } from 'vue'
import useChatHandler from '@/hooks/chat-handler'
import useGlobalHooks from '@/hooks/global-hooks'
import EmojiPicker from './EmojiPicker'

const { sendWebsocketMessage } = useChatHandler()

const { helpers, store } = useGlobalHooks()

const text = ref('')

const refTextarea = ref(null)

const showEmojis = ref(null)

const onPickEmoji = emoji => {
  text.value = helpers.dom.insertCharacter({ character: (store.getters.config.emojis[emoji] || {}).emoji, textarea: refTextarea.value })
  showEmojis.value = false
}

const focusOnInput = () => {
  setTimeout(() => {
    if (refTextarea.value) refTextarea.value.focus()
  })
}

const chatFunctions = {
  image: () => {
    helpers.modal.custom({
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
  helpers.logic.onPasteClipboardImage(
    e,
    url => {
      if (!url) return

      sendTextMessage(url, 'image')
    },
  )
}

onMounted(focusOnInput)

defineExpose({
  refTextarea,
})
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
      height: 44px;
    }

    .fa-paper-plane {
      font-size: 16px;
      cursor: pointer;
    }
  }

  .functions {
    border-right: 1px solid var(--border-base);
    padding: 0 8px 0 0;
    margin-right: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    i,
    .icon-add-emoji {
      max-width: 16px;
      height: 16px;
      line-height: 16px;
      color: var(--text-stress);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      &:hover {
        opacity: 0.5;
      }
    }
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
    opacity: 0.9;

    .left {
      min-width: 0;
      margin-right: 8px;
      flex: 1 1 0;

      .nickname {
        margin-bottom: 4px;
        color: var(--text-stress);
      }
    }

    .clickable-icon-wrapper {
      width: 32px;
      height: 32px;

      .fa-times {
        font-size: 16px;
      }
    }
  }

  .emoji-picker {
    position: absolute;
    bottom: 84px;
    left: var(--app-chat-padding);
    right: var(--app-chat-padding);
    border-radius: 16px;
    z-index: 2;
    font-size: 20px;
  }
}
</style>