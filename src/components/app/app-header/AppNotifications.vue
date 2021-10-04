<template>
  <div class="app-notifications">
    <div class="notifications-list">
      <div
        @click="onClickNotificationItem(notification)"
        class="notification-item"
        :class="{'cursor-pointer': notification.link}"
        :key="notification.id"
        v-for="notification in $store.getters.notifications.data">
        <div class="notification-header">
          <div class="notification-type" v-html="notification.type"/>
          <div class="notification-created-at" v-html="$helpers.template.prettyTime(notification.createdAt, true)"/>
        </div>
        <div class="notification-text" v-html="notification.text"/>
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
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = useStore()

    const router = useRouter()

    const onClickNotificationItem = notification => {
      if (!notification.link) return

      if (notification.link.startsWith('http')) {
        window.open(notification.link, '_blank')
        return
      }

      router.push(notification.link)
    }

    onMounted(() => {
      store.dispatch('loadNotifications')
    })

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
  width: 320px;
  color: var(--text-stress);

  .notification-item {
    padding: 12px 8px;
    user-select: none;

    .notification-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      font-size: 12px;

      .notification-type {
        background: var(--brand-primary);
        color: var(--white);
        padding: 4px 8px;
        border-radius: 24px;
        text-transform: capitalize;
      }

      .notification-created-at {
        font-family: Arial, Helvetica, sans-serif;
      }
    }

    .notification-text {
      font-size: 12px;
      color: var(--text-stress);
    }

    &:hover {
      background: var(--brand-primary-hover-bg);
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

    .fa-bell {
      margin-bottom: 16px;
      font-size: 40px;
    }
  }
}
</style>