<template>
  <div
    @click="$modal.custom({ component: 'ModalChatUsers' })"
    class="app-chat-stats">
    <div class="num-users f-mono">
      <i class="fa fa-user-group m-r-4"/>
      {{ (($store.getters.chatStats || {}).numConnections || 0).toLocaleString() }}
    </div>
    <ChatStatsLongShort/>
  </div>
</template>

<style lang="scss">
.app-chat-stats {
  position: absolute;
  top: 49px;
  height: 72px;
  left: 0;
  right: 0;
  padding: 8px;
  background: linear-gradient(to bottom, var(--background-base), transparent);
  cursor: pointer;

  &:hover {
    background: linear-gradient(to bottom, var(--brand-primary-hover-bg), transparent);
  }

  .num-users {
    font-size: 12px;
    text-align: right;
  }

  .chat-stats-long-short {
    flex-direction: column;
    align-items: flex-end;
    margin-top: 8px;

    .sentiment {
      margin-right: 0 !important;
    }
  }
}
</style>