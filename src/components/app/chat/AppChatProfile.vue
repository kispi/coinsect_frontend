<template>
  <div
    v-if="user"
    class="app-chat-profile lines-1">
    <AppImg
      v-if="user.profile.image"
      class="profile-img"
      :src="user.profile.image"
      @click="$modal.images({
        images: [user.profile.image],
      })"
    />
    <span
      v-else
      class="dot"
      :style="{ background: `#${(user.token || '').slice(0, 6)}` }"
    />
    <span
      @click="openModalBlockUser"
      class="nickname"
      :class="useSentiment ? (user.profile.sentiment || {}).type || '' : ''"
      v-html="user.profile.nickname"
    />
    <BadgeToken :token="user.token" @click="openModalBlockUser"/>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    user: null,
    useSentiment: Boolean,
  },
  setup(props) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const $t = plugins.$translate

    const replacer = str => str.replace('%nickname', props.user.profile.nickname).replace('%token', props.user.token.toUpperCase().slice(0, 3))

    const openModalBlockUser = () => {
      const u = props.user
      const blockedUsers = store.getters.settings.blockedUsers
      plugins.$modal.confirm({
        body: replacer($t(blockedUsers[u.token] ? 'UNBLOCK_USER' : 'BLOCK_USER'))
      }).then(idx => {
        if (idx !== 1) return

        if (blockedUsers[u.token]) delete blockedUsers[u.token]
        else  blockedUsers[u.token] = true
        store.commit('setSettings', { blockedUsers })
      })
    }

    return {
      openModalBlockUser,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-chat-profile {
  display: flex;
  align-items: center;

  .profile-img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 4px;
    cursor: pointer;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 3px;
    margin-right: 4px;
  }

  .nickname {
    color: var(--text-stress);
    margin-right: 8px;

    &.long {
      color: var(--price-up);
    }

    &.short {
      color: var(--price-down);
    }
  }

  .nickname,
  .badge-token {
    cursor: pointer;
  }
}
</style>