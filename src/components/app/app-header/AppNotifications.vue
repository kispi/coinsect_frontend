<template>
  <div class="app-notifications shadowed">
    <div class="notifications-list pretty-scrollbar">
      <div
        @click="onClickNotificationItem(notification)"
        class="notification-item"
        :class="{'cursor-pointer': notification.link}"
        :key="notification.id"
        v-for="notification in ($store.getters.notifications ||{}).data">
        <div class="notification-text" v-html="notification.text"/>
        <div class="passed-time" v-html="$helpers.elapsedTime(notification.createdAt)"/>
      </div>
    </div>
    <div
      v-if="(($store.getters.notifications || {}).data || []).length === 0"
      class="empty">
      <i class="fal fa-bell"/>
      <div>{{ $translate('EMPTY_NOTIFICATIONS') }}</div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup(_, { emit }) {
    const { plugins, store, router } = useGlobalHooks()

    const onClickNotificationItem = notification => {
      if (!notification.link) return

      if (notification.link.startsWith('http')) {
        window.open(notification.link, '_blank')
        emit('close')
        return
      }

      router.push(notification.link)
      emit('close')
    }

    const init = async () => {
      const list = (store.getters.notifications || {}).data || []
      if (list.length > 0) {
        plugins.$helpers.localStorage.setMeta('lastNotificationId', (list[0]).id)
      }
      store.dispatch('loadNotifications')
    }

    onMounted(init)

    return {
      onClickNotificationItem,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-notifications {
  background: var(--background-base);
  border: 1px solid var(--border-base);
  border-radius: 4px;
  width: 360px;
  max-width: calc(100vw - 32px);
  color: var(--text-stress);
  display: flex;

  .notifications-list {
    overflow-y: auto;
    max-height: 400px;
  }

  .notification-item {
    padding: 12px 16px 12px 8px;
    user-select: none;

    .notification-text {
      font-size: 12px;
      color: var(--text-stress);
    }

    .passed-time {
      display: table;
      margin-left: auto;
      margin-top: 8px;
      font-size: 12px;
      color: var(--gs-66);
    }

    &:hover {
      background: var(--background-light);
    }

    &:not(:last-child) {
      border-bottom: 1px solid var(--border-base);
    }
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    margin: auto;

    .fa-bell {
      margin-bottom: 16px;
      font-size: 40px;
    }
  }
}
</style>