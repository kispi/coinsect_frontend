<template>
  <div class="modal-chat-users scrollable-body">
    <ModalHeader :title="`${$translate('MODAL_CHAT_USERS')} (${(connections || []).length})`" @close="$emit('close')"/>
    <div class="body">
      <div class="connections pretty-scrollbar">
        <div
          class="connection"
          :key="idx"
          v-for="(connection, idx) in connections">
          <AppChatProfile :user="connection.user"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed, getCurrentInstance, onMounted, onUnmounted } from 'vue'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const connection = computed(() => store.getters.websocketConnections.chat)

    const connections = ref(null)

    const timeout = ref(null)

    const loadConnections = () => {
      connection.value.send(JSON.stringify({
        type: 'connections',
        user: {
          token: store.getters.me.token,
        },
      }))

      timeout.value = setTimeout(loadConnections, 1000 * 60)
    }

    const onIncomingConnections = message => {
      connections.value = message.meta
      connections.value.sort((a, b) => {
        if (a.user.profile.image && b.user.profile.image) {
          return a.user.profile.nickname > b.user.profile.nickname ? 1 : -1
        }

        if (a.user.profile.image && !b.user.profile.image) return -1
        if (!a.user.profile.image && b.user.profile.image) return -1

        return a.user.profile.nickname > b.user.profile.nickname ? 1 : -1
      })
    }

    onMounted(() => {
      plugins.$bus.$on('incoming-connections', onIncomingConnections)
      loadConnections()
    })

    onUnmounted(() => {
      plugins.$bus.$off('incoming-connections', onIncomingConnections)
      clearTimeout(timeout.value)
    })

    return {
      connections,
    }
  },
}
</script>

<style lang="scss" scoped>
.modal-chat-users {
  min-width: 320px;

  .body {
    max-height: 640px;
    height: 100%;
    display: flex;
    flex-direction: column;

    .connections {
      padding: 16px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      height: 100%;
      overflow-y: auto;
      overscroll-behavior: contain;

      .connection {
        padding: 0 4px;
        font-size: 12px;
        display: flex;
        align-items: center;
        height: 24px;
      }
    }
  }

  @media (max-width: 767px) {
    .body {
      .connections {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}
</style>