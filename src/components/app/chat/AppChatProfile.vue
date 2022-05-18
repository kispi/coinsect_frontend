<template>
  <div
    v-if="user"
    class="app-chat-profile">
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
    <span class="name" v-html="user.profile.nickname"/>
    <BadgeToken :token="user.token"/>
  </div>
</template>

<script>
export default {
  props: ['user'],
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

  .name {
    color: var(--text-stress);
    margin-right: 8px;
  }
}
</style>