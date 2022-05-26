<template>
  <div
    @click="$modal.custom({
      component: 'ModalChatUsers',
    })"
    class="app-chat-stats">
    <div
      class="num-users f-mono"
      :class="numUsersClass">
      <i class="fa fa-user-group m-r-4"/>
      {{ (($store.getters.chatStats || {}).numConnections || 0).toLocaleString() }}
    </div>
    <ChatStatsLongShort/>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const numUsersClass = ref(null)

    watch(
      () => (store.getters.chatStats || {}).numConnections,
      (newVal, oldVal) => {
        if (!newVal || !oldVal) return

        if (newVal > oldVal) numUsersClass.value = 'c-price-up'
        if (newVal < oldVal) numUsersClass.value = 'c-price-down'
      },
    )

    return {
      numUsersClass,
    }
  },
}
</script>

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