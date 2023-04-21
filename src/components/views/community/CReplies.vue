<template>
  <div
    v-if="repliesToDisplay.length > 0"
    class="c-replies"
    :class="`depth-${depth}`">
    <div
      class="reply"
      :key="reply.id"
      v-for="reply in repliesToDisplay">
      <div class="reply-body">
        <div class="reply-header">
          <div class="reply-user" :class="{'authorized-clickable-nickname': reply.userId}">
            <UserSymbol :user="reply.user" class="m-r-4"/>
            <span
              @click="reply.userId ? $modal.custom({ component: 'ModalUserStats', options: { user: reply.user } }) : null"
              v-html="$helpers.template.writer(reply)"
            />
          </div>
          <div class="reply-functions">
            <!-- <div @click="onClickEdit(reply)" class="reply-edit" v-html="$translate('EDIT')"/> -->
            <div
              v-if="$helpers.writing.canModify(reply)"
              @click="onClickDelete(reply)"
              class="reply-delete">
              {{ $translate('DELETE') }}
            </div>
            <div
              @click="reply.$$showReply = !reply.$$showReply"
              class="reply-reply">
              {{ $translate(reply.$$showReply ? 'CANCEL' : 'REPLY_REPLY') }}
            </div>
          </div>
        </div>
        <div
          @click="$helpers.onClickHTMLContent"
          class="content"
          v-html="reply.deletedAt ? `<b>${$translate('DELETED_REPLY')}</b>` : reply.content"/>
        <div class="created-at" v-html="$helpers.template.prettyTime(reply.createdAt, true)"/>
      </div>
      <div v-if="reply.$$showReply" class="reply-write-container">
        <ReplyWrite :post="$store.getters.post" :parent="reply" @cancel="reply.$$showReply = false"/>
      </div>
      <CReplies :replies="reply.replies" :depth="depth + 1"/>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import communityService from '@/services/community'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  props: {
    replies: Array,
    depth: {
      type: Number,
      default: 0,
    }
  },
  setup(props) {
    const { plugins, store, router } = useGlobalHooks()

    const repliesToDisplay = computed(() => (props.replies || []).filter(o => !o.deletedAt || hasNonDeletedChild(o)))

    const hasNonDeletedChild = reply => {
      return (reply.replies || []).some(child => !child.deletedAt || hasNonDeletedChild(child))
    }

    const onConfirmDelete = async ({ id, password }) => {
      try {
        await communityService.remove.reply({ id, password })
        store.dispatch('loadPost', router.currentRoute.value.params.sharingKey)
        store.dispatch('loadPosts')
        plugins.$toast.success('댓글을 삭제했습니다')
      } catch (e) {
        plugins.$toast.error(e.data.message)
      }
    }

    const onClickDelete = async reply => {
      if (plugins.$helpers.writing.isMine(reply)) {
        const ok = await plugins.$modal.confirm({ body: '내 댓글을 삭제하시겠습니까?' })
        if (ok) onConfirmDelete({ id: reply.id })
      } else {
        const password = await plugins.$modal.input({ title: '댓글 비밀번호를 입력하세요', inputType: 'password', autocomplete: 'post-password' })
        if (password) onConfirmDelete({ id: reply.id, password })
      }
    }

    return {
      repliesToDisplay,
      hasNonDeletedChild,
      onClickDelete,
    }
  },
}
</script>

<style lang="scss">
.c-replies {
  font-size: 13px;

  .reply {
    .content {
      padding: 8px 0;
      color: var(--text-stress);
      white-space: pre-line;

      img {
        max-width: 320px !important;
        cursor: pointer;
      }
    }

    .created-at {
      color: var(--gs-88);
      font-size: 12px;
    }

    .reply-body {
      border-bottom: 1px solid var(--border-base);
      padding: 8px 0;
    }

    .reply-header {
      display: flex;
      justify-content: space-between;

      .reply-functions {
        display: flex;

        div {
          &:not(:last-child) {
            margin-right: 8px;
            padding-right: 8px;
            border-right: 1px solid var(--border-light);
          }

          &:hover {
            text-decoration: underline;
            cursor: pointer;
          }
        }
      }
    }
  }

  .reply-write-container {
    padding: 8px;
    margin-top: 8px;
  }

  @mixin depths() {
    $i: 1;
    @while $i <= 10 {
      &.depth-#{$i} {
        .reply-body {
          padding-left: #{$i * 12} + 'px';
        }
      }
      $i: $i + 1;
    }
  }

  @include depths();
}
</style>