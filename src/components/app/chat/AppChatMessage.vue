<template>
  <div
    class="app-chat-message"
    :class="{'mine': message.isMine}">
    <div
      v-if="message.profile"
      class="profile">
      <img :src="message.profile.image">
    </div>
    <div class="content">
      <div
        v-if="message.profile"
        class="nickname"
        v-html="message.profile.nickname"
      />
      <div class="text-and-timestamp">
        <div class="text" v-html="message.text"/>
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
  margin-bottom: 12px;
  display: flex;

  .profile {
    margin-right: 8px;

    img {
      width: 24px;
    }
  }

  .content {
    width: 100%;
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

    .profile,
    .nickname {
      display: none;
    }
  }
}
</style>