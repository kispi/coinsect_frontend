<template>
  <div
    class="app-chat-message"
    :class="{'mine': message.isMine}">
    <div class="content">
      <div
        v-if="message.profile"
        class="nickname">
        <span v-html="message.profile.nickname"/>
        <span class="token" v-html="(message.token || '').substring(0, 3)"/>
      </div>
      <div class="text-and-timestamp">
        <div class="text">{{ message.text }}</div>
        <div
          class="timestamp"
          :class="message.isMine ? 'm-r-8' : 'm-l-8'"
          v-html="$helpers.dayjs(message.timestamp).format('HH:mm')"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['message'],
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

      span:not(.token) {
        color: var(--text-stress);
      }

      .token {
        font-weight: 300;
        font-size: 10px;
        margin-left: 8px;
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
      color: var(--text-light);
      flex: 0 0 auto;
      font-size: 10px;
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