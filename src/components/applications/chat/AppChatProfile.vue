<template>
  <div
    v-if="user"
    class="app-chat-profile lines-1"
    :class="{
      'authenticated': user.id,
    }">
    <AppImg
      v-if="(user.profile || {}).image"
      class="profile-img"
      :src="user.profile.image"
      @click="magnifyUserImage"
    />
    <template v-else>
      <span
        v-if="!user.id"
        class="dot"
        :style="{ background: `#${(user.token || '').slice(0, 6)}` }"
      />
      <i
        v-else
        class="fa fa-shield-check m-r-4"
        :style="{ color: `#${(user.token || '').slice(0, 6)}` }"
      />
    </template>
    <span
      @click="user.id ? $modal.custom({
        component: 'ModalUserStats',
        options: { user },
      }) : null"
      class="nickname"
      :class="{
        'cursor-pointer': user.id,
        'c-price-up-bybit': useSentiment && ((user.profile || {}).sentiment || {}).type === 'long',
        'c-price-down-bybit': useSentiment && ((user.profile || {}).sentiment || {}).type === 'short',
      }"
      v-html="(user.profile || {}).nickname"
    />
    <BadgeToken
      v-if="!user.id"
      :token="user.token"
      class="m-l-4"
    />
    <i
      v-if="user.token && useBan"
      class="fal fa-ban m-l-4 cursor-pointer f-10"
      @click="openModalBlockUser"
    />
  </div>
</template>

<script>
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  props: {
    user: null,
    useBan: null,
    useSentiment: null,
  },
  setup(props) {
    const { plugins, store } = useGlobalHooks()

    const $t = plugins.$translate

    const replacer = str => str.replace('%nickname', props.user.profile.nickname).replace('%token', (props.user.token || '').toUpperCase().slice(0, 3))

    const magnifyUserImage = () => plugins.$modal.images({
      images: [(props.user.profile || {}).image],
    })

    const openModalBlockUser = () => {
      if (!props.user.token) return

      const blockedUsers = store.getters.settings.blockedUsers
      plugins.$modal.confirm({
        body: replacer($t(blockedUsers[props.user.token] ? 'UNBLOCK_USER' : 'BLOCK_USER'))
      }).then(idx => {
        if (idx !== 1) return

        if (blockedUsers[props.user.token]) delete blockedUsers[props.user.token]
        else blockedUsers[props.user.token] = true
        store.commit('setSettings', { blockedUsers })
      })
    }

    return {
      openModalBlockUser,
      magnifyUserImage,
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
  }

  &.authenticated {
    font-weight: 700;
  }
}
</style>
