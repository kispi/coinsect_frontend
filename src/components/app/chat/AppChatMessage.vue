<template>
  <div
    class="app-chat-message"
    :class="{'mine': message.isMine}">
    <div class="content" :class="{'m-t-12': !(prevMessage ||{}).isMine && (message || {}).isMine}">
      <AppChatProfile v-if="showProfile" :user="message"/>
      <div class="text-and-timestamp">
        <AppImg
          @click="$modal.images({
            images: [message.text],
          })"
          v-if="message.type === 'image'"
          :src="message.text"
        />
        <div
          v-if="['text', 'alert'].indexOf(message.type) >= 0"
          class="text"
          v-html="$helpers.dom.linkify(message.text)"
        />
        <div
          v-if="showTimestamp"
          class="timestamp f-mono"
          :class="message.isMine ? 'm-r-8' : 'm-l-8'"
          v-html="$helpers.dayjs(message.timestamp).format('HH:mm')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance } from 'vue'

export default {
  props: ['prevMessage', 'message', 'nextMessage'],
  setup(props) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const d = ts => plugins.$helpers.dayjs(ts).format('YYYY-MM-DD HH:mm')

    const showProfile = computed(() => {
      if (props.message.isMine) return

      if (!props.message.profile) return

      if (!props.prevMessage) return true

      return props.prevMessage.token !== props.message.token ||
        d(props.prevMessage.timestamp) !== d(props.message.timestamp)
    })

    const showTimestamp = computed(() => {
      if (!props.nextMessage) return true

      // 직전 메시지와 다음 메시지를 다른 유저가 보낸 경우
      if (props.nextMessage.token !== props.message.token) return true

      // 직전 메시지와 다음 메시지의 유저가 같으나 타임스탬프도 1분 이상 차이가 나는 경우
      return d(props.nextMessage.timestamp) !== d(props.message.timestamp)
    })

    return {
      showProfile,
      showTimestamp,
    }
  },
}
</script>

<style lang="scss">
.app-chat-message {
  font-size: 12px;
  display: flex;

  .content {
    width: 100%;

    .app-chat-profile {
      margin-top: 12px;
      margin-bottom: 8px;
    }
  }

  .text-and-timestamp {
    display: flex;
    align-items: flex-end;
    margin: 4px 0;

    img {
      width: 160px; // 크기를 미리 지정해줘야 cumulative layout shift를 방지해서 scrollToBottom이 올바로 최하단으로 스크롤하도록 할 수 있다.
      height: 160px;
      border-radius: 8px;
      cursor: pointer;
    }

    .text {
      background: var(--background-light);
      padding: 4px 8px;
      border-radius: 4px;
      max-width: 80%;
      color: var(--text-stress);
      white-space: pre-line;
    }

    .timestamp {
      flex: 0 0 auto;
      font-size: 10px;
      margin-bottom: 2px;
    }
  }

  &.mine {
    justify-content: flex-end;

    .text-and-timestamp {
      flex-direction: row-reverse;
    }
  }
}
</style>