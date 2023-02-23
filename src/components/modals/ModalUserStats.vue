<template>
  <div
    ref="refModal"
    class="modal-user-stats">
    <ModalHeader :title="$translate('MODAL_USER_STATS')" @close="$emit('close')"/>
    <div class="body">
      <AppLoading :loading="loading"/>
      <div
        v-if="options.user"
        class="user">
        <UserSymbol :user="options.user" class="m-r-4"/>
        <div class="nickname">{{ (options.user.profile || {}).nickname }}</div>
      </div>
      <div
        v-if="data"
        class="stats m-t-16">
        <div>채팅: {{ data.stats.numMessages }}</div>
        <div class="slash">/</div>
        <div>글: {{ data.stats.numPosts }}</div>
        <div class="slash">/</div>
        <div>댓글: {{ data.stats.numReplies }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import userService from '@/services/user'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  props: ['options'],
  setup(props, { emit }) {
    const { plugins } = useGlobalHooks()

    const refModal = ref(null)

    const data = ref(null)

    const loading = ref(null)

    const init = async () => {
      try {
        loading.value = true
        data.value = await userService.userStats(props.options.user.id)
      } catch (e) {
        plugins.$toast.error('해당 유저의 활동 내역을 가져오는데 실패했습니다')
        emit('close')
      } finally {
        loading.value = false
        plugins.$helpers.modal.center(refModal.value)
      }
    }

    onMounted(init)

    return {
      refModal,
      data,
      loading,
    }
  },
}
</script>

<style lang="scss" scoped>
.modal-user-stats {
  border-radius: 4px;
  width: 320px;
  color: var(--text-stress);

  .body {
    padding: 16px;
    position: relative;
  }

  .user {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: 700;
  }

  .stats {
    display: flex;
    justify-content: center;
    font-size: 16px;

    .slash {
      margin: 0 8px;
    }
  }
}
</style>