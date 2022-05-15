<template>
  <div
    class="app-chat-message"
    :class="{'mine': message.isMine}">
    <div class="content" :class="{'m-t-12': prevMessage?.isMine !== message?.isMine}">
      <div
        v-if="showNickname"
        class="nickname"
        :class="{'admin': $store.getters.config.adminToken === message.token}">
        <span class="dot" :style="{ background: `#${(message.token || '').slice(0, 6)}` }"/>
        <span class="name" v-html="message.profile.nickname"/>
        <BadgeToken :token="message.token"/>
      </div>
      <div class="text-and-timestamp">
        <div class="text">{{ message.text }}</div>
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
import BadgeToken from './BadgeToken'

export default {
  components: {
    BadgeToken,
  },
  props: ['prevMessage', 'message', 'nextMessage'],
  setup(props) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const d = ts => plugins.$helpers.dayjs(ts).format('YYYY-MM-DD HH:mm')

    const showNickname = computed(() => {
      if (!props.message.profile) return

      if (!props.prevMessage) return true

      return props.prevMessage.token !== props.message.token
    })

    const showTimestamp = computed(() => {
      if (!props.nextMessage) return true

      // 직전 메시지와 다음 메시지를 다른 유저가 보낸 경우
      if (props.nextMessage.token !== props.message.token) return true

      // 직전 메시지와 다음 메시지의 유저가 같으나 타임스탬프도 1분 이상 차이가 나는 경우
      return d(props.nextMessage.timestamp) !== d(props.message.timestamp)
    })

    return {
      showNickname,
      showTimestamp,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-chat-message {
  font-size: 12px;
  display: flex;

  .content {
    width: 100%;

    .nickname {
      text-transform: uppercase;
      display: flex;
      align-items: baseline;
      margin-top: 12px;

      &.admin {
        .name {
          color: var(--brand-primary);
        }

        .dot,
        .badge-token {
          display: none;
        }
      }

      .dot {
        width: 6px;
        height: 6px;
        border-radius: 3px;
        margin-right: 4px;
      }

      .name {
        color: var(--text-stress);
        margin-right: 8px;
      }
    }
  }

  .text-and-timestamp {
    display: flex;
    align-items: flex-end;
    margin: 4px 0;

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

    .nickname {
      display: none;
    }
  }
}
</style>