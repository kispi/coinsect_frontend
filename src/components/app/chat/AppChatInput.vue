<template>
  <div class="app-chat-input">
    <!-- <div class="functions">
      <i @click="chatFunctions.image" class="fa fa-image"/>
    </div> -->
    <div class="textarea-wrapper">
      <textarea
        ref="refTextarea"
        v-model="text"
        @keydown="onKeydown"
        @paste="onPaste"
        :maxlength="120"
        placeholder="이미지를 첨부하려면 스크린샷 후 Ctrl + V"
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
      image: async () => {
        try {
          const url = await plugins.$modal.custom({
            component: 'ModalImageUploader',
            options: {
              noupload: true,
            },
          })
          if (url) console.log(url)
        } catch (e) {}
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

    const onPaste = e => {
      const items = (e.clipboardData || event.originalEvent.clipboardData).items
      const img = items[0]
      if (!img.type.includes('image')) return

      const file = img.getAsFile()
      const reader = new FileReader()
      reader.onload = e => {
        plugins.$modal.custom({
          component: 'ModalSendImage',
          options: {
            file,
            url: e.target.result,
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

  .functions {
    padding: 8px;

    i {
      cursor: pointer;

      &:hover {
        color: var(--brand-primary);
      }
    }
  }
}
</style>