<template>
  <div
    ref="refModal"
    class="modal-user-stats">
    <ModalHeader :title="helpers.translate('MODAL_USER_STATS')" @close="$emit('close')"/>
    <div class="body">
      <AppLoading :loading="loading"/>
      <div
        v-if="options.user"
        class="user">
        <UserSymbol :user="options.user" class="m-r-4"/>
        <div class="nickname">{{ (options.user.profile || {}).nickname }}</div>
      </div>
      <div
        v-if="stats"
        class="stats m-t-16">
        <div>채팅: {{ stats.numMessages }}</div>
        <div class="slash">/</div>
        <div>글: {{ stats.numPosts }}</div>
        <div class="slash">/</div>
        <div>댓글: {{ stats.numReplies }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AccountStats, User } from '@/types'
import { onMounted, ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'
import userService from '@/services/user'

const props = defineProps<{
  options: { user: User }
}>()

const emit = defineEmits(['close'])

const { helpers } = useGlobalHooks()

const refModal = ref<HTMLElement | null>(null)

const stats = ref<AccountStats>()

const loading = ref(false)

const init = async () => {
  try {
    loading.value = true
    const data = await userService.userStats(props.options.user.id as number)
    stats.value = data.stats
  } catch (e) {
    helpers.toast.error('해당 유저의 활동 내역을 가져오는데 실패했습니다')
    emit('close')
  } finally {
    loading.value = false
    if (refModal.value) helpers.modal.center(refModal.value)
  }
}

onMounted(init)
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