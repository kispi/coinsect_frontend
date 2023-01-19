<template>
  <div
    ref="refModalChatUsers"
    class="modal-chat-users scrollable-body">
    <ModalHeader :title="`${$translate('MODAL_CHAT_USERS')} (${$store.getters.chatStats.numConnections})`" @close="$emit('close')"/>
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
        v-if="selectedTab === 'BLOCKED'"
        class="btn-container">
        <button
          class="btn btn-primary"
          @click="$store.commit('setSettings', { blockedUsers: {} })"
          v-html="$translate('UNBLOCK_ALL')"
        />
      </div>
      <div
        v-if="tabs[selectedTab].length > 0"
        class="users pretty-scrollbar">
        <div
          class="user"
          :key="idx"
          v-for="(user, idx) in tabs[selectedTab]">
          <AppChatProfile :user="user" :useBan="true"/>
        </div>
      </div>
      <div
        v-if="tabs[selectedTab].length === 0 && !loading"
        class="empty">
        유저가 없습니다
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { plugins, store } = useGlobalHooks()

    const refModalChatUsers = ref(null)

    const centered = ref(null) // 모달이 로드된 직후 한번만 true로 설정하고 그 뒤로는 바뀔 일 없음

    const connection = computed(() => store.getters.chat.connection)

    const users = computed(() => store.getters.chatUsers || [])

    const sorted = ref([])

    const loading = ref(true)

    const tabs = computed(() => {
      const nonBlocked = []
      const blocked = []

      sorted.value.forEach(c => {
        (store.getters.settings.blockedUsers[c.token] ? blocked : nonBlocked).push(c)
      })

      return {
        'NON_BLOCKED': nonBlocked,
        'BLOCKED': blocked,
      }
    })

    const selectedTab = ref('NON_BLOCKED')

    const interv = ref(null)

    const loadUsers = () => {
      loading.value = true
      connection.value.send(JSON.stringify({
        type: 'users',
        user: {
          token: store.getters.chatUser.token,
        },
      }))
    }

    const init = () => {
      loading.value = false
      const arr = JSON.parse(JSON.stringify(users.value))
      arr.sort((a, b) => {
        if (a.profile.image && b.profile.image) {
          return a.profile.nickname > b.profile.nickname ? 1 : -1
        }

        if (a.profile.image) return -1

        if (b.profile.image) return 1

        return a.profile.nickname > b.profile.nickname ? 1 : -1
      })

      sorted.value = arr
    }

    onMounted(() => {
      loadUsers()
      interv.value = setInterval(loadUsers, 1000 * 60)
    })

    onUnmounted(() => {
      clearInterval(interv.value)
    })

    watch(
      () => sorted.value,
      () => {
        if (!centered.value) {
          plugins.$helpers.modal.center(refModalChatUsers.value)
          centered.value = true
        }
      },
    )

    watch(
      () => selectedTab.value,
      () => plugins.$helpers.modal.center(refModalChatUsers.value),
    )

    watch([
      () => store.getters.chatStats.numConnections,
      () => store.getters.chatStats.numBulls,
      () => store.getters.chatStats.numBears,
    ],
      () => {
        loadUsers()
        init()
      },
    )

    watch(
      () => store.getters.chatUsers,
      init,
    )

    return {
      refModalChatUsers,
      selectedTab,
      loading,
      tabs,
      users,
    }
  },
}
</script>

<style lang="scss">
.modal-chat-users {
  width: 640px;
  max-height: 80vh;

  .body {
    height: 100%;
    display: flex;
    flex-direction: column;

    .chat-stats-long-short {
      margin: 8px auto;
    }

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
        border: 1px solid var(--border-base);
        border-radius: 4px;
        margin: 8px;
        cursor: pointer;

        &.selected {
          color: var(--white);
          background: var(--brand-primary);
        }

        &:not(.selected):hover {
          background: var(--brand-primary-hover-bg);
        }
      }
    }

    .empty {
      color: var(--text-stress);
      font-size: 24px;
      font-weight: 700;
      margin: 40px auto;
    }

    .users {
      padding: 16px;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      overflow-y: auto;
      overscroll-behavior: contain;

      .user {
        padding: 0;
        font-size: 12px;
        display: flex;
        align-items: center;
        height: 24px;

        .app-chat-profile {
          .app-img {
            width: 20px;
            height: 20px;
          }

          .fa-ban {
            padding-right: 2px;
          }
        }
      }
    }
  }

  @media (max-width: 767px) {
    .body {
      .users {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}
</style>
