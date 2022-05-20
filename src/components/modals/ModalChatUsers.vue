<template>
  <div
    ref="refModalChatUsers"
    class="modal-chat-users scrollable-body">
    <ModalHeader :title="`${$translate('MODAL_CHAT_USERS')} (${connections.length})`" @close="$emit('close')"/>
    <div class="body">
      <div class="tabs">
        <div
          class="tab"
          :class="{'selected': selectedTab === key}"
          @click="selectedTab = key"
          :key="key"
          v-for="key in Object.keys(tabs)">
          {{ $translate(key) }} ({{ tabs[key].length }})
        </div>
      </div>
      <div
        v-if="selectedTab === 'BLOCKED' && tabs.BLOCKED.length > 0"
        class="btn-container">
        <button
          class="btn btn-primary"
          @click="$store.commit('setSettings', { blockedUsers: {} })"
          v-html="$translate('UNBLOCK_ALL')"
        />
      </div>
      <div
        v-if="tabs[selectedTab].length > 0"
        class="connections pretty-scrollbar">
        <div
          class="connection"
          :key="idx"
          v-for="(connection, idx) in tabs[selectedTab]">
          <AppChatProfile :user="connection.user"/>
        </div>
      </div>
      <div
        v-else
        class="empty">
        유저가 없습니다
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

    const refModalChatUsers = ref(null)

    const centered = ref(null) // 모달이 로드된 직후 한번만 true로 설정하고 그 뒤로는 바뀔 일 없음

    const connection = computed(() => store.getters.websocketConnections.chat)

    const connections = ref([])

    const tabs = computed(() => {
      const nonBlocked = []
      const blocked = []
      connections.value.forEach(c => (store.getters.settings.blockedUsers[c.user.token] ? blocked : nonBlocked).push(c))

      return {
        'NON_BLOCKED': nonBlocked,
        'BLOCKED': blocked,
      }
    })

    const selectedTab = ref('NON_BLOCKED')

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

      if (!centered.value) {
        plugins.$helpers.modal.center(refModalChatUsers.value)
        centered.value = true
      }
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
      refModalChatUsers,
      selectedTab,
      tabs,
      connections,
    }
  },
}
</script>

<style lang="scss" scoped>
.modal-chat-users {
  width: 560px;

  .body {
    height: 100%;
    display: flex;
    flex-direction: column;

    .btn-container {
      padding: 16px;
    }

    .btn-primary {
      width: 100%;
    }

    .tabs,
    .btn-container {
      border-bottom: 1px solid var(--border-base);
    }

    .tabs {
      display: flex;

      .tab {
        padding: 8px;
        flex: 1;
        color: var(--text-stress);
        text-align: center;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;

        &.selected {
          color: var(--white);
          background: var(--brand-primary);
        }
      }
    }

    .empty {
      color: var(--text-stress);
      font-size: 24px;
      font-weight: 700;
      margin: 40px auto;
    }

    .connections {
      padding: 16px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
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