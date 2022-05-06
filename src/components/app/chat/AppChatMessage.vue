<template>
  <div
    class="app-chat-message"
    :class="{'mine': message.isMine}">
    <div class="content">
      <div
        v-if="message.profile"
        class="nickname"
        :class="{'admin': $store.getters.config.adminToken === message.token}">
        <span class="dot" :style="{ background: `#${(message.token || '').slice(0, 6)}` }"/>
        <span class="name" v-html="message.profile.nickname"/>
        <span class="token" v-html="(message.token || '').substring(0, 3)"/>
      </div>
      <div class="text-and-timestamp">
        <div class="text">{{ message.text }}</div>
        <div
          class="timestamp f-mono"
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
      display: flex;
      align-items: baseline;

      &.admin {
        .name {
          color: var(--brand-primary);
        }

        .dot,
        .token {
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
      }

      .token {
        font-weight: 300;
        font-size: 10px;
        margin-left: 8px;
        padding: 0 4px;
        border: 1px solid var(--border-base);
        border-radius: 16px;
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