<template>
  <div class="view-post-detail view-layout-default">
    <ButtonCommunity/>
    <CPost :post="post"/>
    <div class="post-detail-buttons">
      <div class="to-list">
        <button
          @click="$router.push('/community')"
          class="btn btn-default"
          v-html="$translate('TO_LIST')"
        />
      </div>
      <div class="c-u-d">
        <button
          @click="button.handler"
          class="btn"
          :class="button.class"
          v-html="$translate(button.text)"
          :key="button.text"
          v-for="button in (buttons || []).filter(o => !o.$$hide)"
        />
      </div>
    </div>
    <TablePosts/>
  </div>
</template>

<script>
import { computed, getCurrentInstance, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import CPost from './CPost'
import TablePosts from './TablePosts'
import communityService from '@/services/community'
import crudService from '@/services/crud'

export default {
  components: { CPost, TablePosts },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const router = useRouter()

    const post = computed(() => store.getters.post)

    const onConfirmDelete = async () => {
      try {
        await crudService.post.delete(post.value.id)
        await store.dispatch('loadPosts')
        router.push('/community')
      } catch (e) {
        plugins.$toast.error(e.data.message)
      }
    }

    const handlers = {
      write: () => router.push('/community/write'),
      edit: () => router.push(`/community/edit/${post.value.id}`),
      delete: () => {
        plugins.$modal.input({ title: '비밀번호를 입력하세요', inputType: 'password', autocomplete: 'post-password' })
          .then(value => {
            if (!value) return

            communityService.checkPassword({ id: post.value.id, type: 'post', password: value })
              .then(onConfirmDelete)
              .catch(() => {
                plugins.$toast.error('비밀번호가 틀립니다')
              })
          })
      },
    }

    const buttons = computed(() => {
      if (!post.value) return

      const arr = [{
        text: 'WRITE',
        class: 'btn-primary',
        handler: handlers.write,
      }, {
        text: 'EDIT',
        class: 'btn-default',
        handler: handlers.edit,
        $$hide: (post.value.user || {}).id !== (store.getters.me || {}).id,
      }, {
        text: 'DELETE',
        class: 'btn-danger',
        handler: handlers.delete,
        $$hide: (post.value.user || {}).id !== (store.getters.me || {}).id,
      }]

      return arr
    })

    const loadPost = () => store.dispatch('loadPost', router.currentRoute.value.params.id)

    watch(
      () => router.currentRoute.value.params.id,
      (newVal, oldVal) => {
        if (newVal === oldVal) return

        if (router.currentRoute.value.name !== 'ViewPostDetail') return

        loadPost()
      },
    )

    onMounted(loadPost)

    return {
      post,
      buttons,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-post-detail {
  .post-detail-buttons {
    padding: 16px 0;
    border-top: 1px solid var(--border-base);
    border-bottom: 1px solid var(--border-base);
    display: flex;
    justify-content: space-between;

    .to-list {}

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
}
</style>