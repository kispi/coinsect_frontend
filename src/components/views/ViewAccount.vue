<template>
  <div
    v-if="profile"
    class="view-account">
    <AppImg :src="$helpers.withCdn(profile.image)" class="profile-image"/>
    <div class="form-control">
      <label>{{ $translate('NICKNAME') }}</label>
      <div class="flex-row">
        <input v-model="profile.nickname" class="flex-fill">
        <button
          @click="updateNickname"
          class="btn btn-primary flex-wrap"
          :disabled="profile.nickname === originalNickname">
          {{ $translate('CHANGE') }}
        </button>
      </div>
      {{ originalNickname}}
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const profile = ref(null)

    const originalNickname = computed(() => store.getters.me.profile.nickname)

    const updateNickname = async () => {
      store.dispatch('updateProfile', profile.value)
    }

    const init = async () => {
      try {
        await store.dispatch('loadMe')
        profile.value = store.getters.me.profile
      } catch (e) {}
    }

    onMounted(init)

    return {
      profile,
      originalNickname,
      updateNickname,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-account {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 240px;
  margin: auto;

  .profile-image {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin: 24px auto;
    cursor: pointer;
  }
}
</style>