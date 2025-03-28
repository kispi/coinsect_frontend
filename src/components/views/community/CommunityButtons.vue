<template>
  <div class="community-buttons">
    <div class="to-list">
      <button
        @click="router.push('/community')"
        class="btn btn-brd"
        v-html="helpers.translate('TO_LIST')"
      />
    </div>
    <div class="c-u-d">
      <button
        @click="button.handler"
        class="btn btn-brd"
        :class="button.class"
        v-html="helpers.translate(button.text)"
        :key="button.text"
        v-for="button in buttons"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import communityService from '@/services/community'
import useGlobalHooks from '@/hooks/global-hooks'
import usePost from '@/hooks/post'

const { helpers, store, router } = useGlobalHooks()

const { checkPasswordAndAllowEdit } = usePost()

const post = computed(() => store.getters.post)

const onConfirmDelete = async ({ sharingKey, password }) => {
  try {
    await communityService.remove.post({ sharingKey, password })
    router.push('/community')
    helpers.toast.success('게시글을 삭제했습니다')
  } catch (e) {
    helpers.toast.error(e.data.message)
  }
}

const handlers = {
  write: () => helpers.modal.custom({
    component: 'ModalPostEditor',
    options: {
      preventCloseOnClickBackdrop: true,
    },
  }),
  edit: () => checkPasswordAndAllowEdit(post.value),
  delete: async () => {
    if (helpers.logic.writing.isMine(post.value)) {
      const ok = await helpers.modal.confirm({ body: '내 게시글을 삭제할까요?' })
      if (ok) onConfirmDelete({ sharingKey: post.value.sharingKey })
    } else {
      const password = await helpers.modal.input({ title: '게시글 비밀번호를 입력하세요', inputType: 'password', autocomplete: 'post-password' })
      if (password) onConfirmDelete({ sharingKey: post.value.sharingKey, password })
    }
  },
}

const buttons = computed(() => {
  const arr = [{
    text: 'WRITE',
    handler: handlers.write,
  }]

  if (!post.value) return arr

  if (post.value.postType === 'normal' && helpers.logic.writing.canModify(post.value)) {
    arr.push({
      text: 'EDIT',
      handler: handlers.edit,
    })
    arr.push({
      text: 'DELETE',
      handler: handlers.delete,
    })
  }

  return arr
})
</script>

<style lang="scss" scoped>
.community-buttons {
  padding: 16px 0;
  border-bottom: 1px solid var(--border-base);
  display: flex;
  justify-content: space-between;

  .c-u-d {
    display: flex;

    button {
      width: 64px;

      &:not(:last-child) {
        margin-right: 8px;
      }
    }
  }
}
</style>