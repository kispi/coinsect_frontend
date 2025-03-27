<template>
  <div
    v-if="repliesToDisplay.length > 0"
    class="c-replies">
    <div
      class="reply"
      :key="reply.id"
      v-for="reply in repliesToDisplay">
      <div
        class="reply-body"
        :style="{'padding-left': `${depth * 24}px`}">
        <div class="reply-header">
          <div class="reply-user" :class="{'authorized-clickable-nickname': reply.userId}">
            <UserSymbol :user="reply.user" class="m-r-4"/>
            <span
              @click="reply.userId ? helpers.modal.custom({ component: 'ModalUserStats', options: { user: reply.user } }) : null"
              v-html="helpers.template.writer(reply)"
            />
          </div>
          <div class="reply-functions">
            <div
              @click="toggleReaction(reply.id, 'thumbs_up')"
              class="vote function f-mono">
              <i class="fa-thumbs-up" :class="((reply.summary.reactions || {}).thumbs_up || {}).activated ? 'fa' : 'fal'"/>{{ ((reply.summary.reactions || {}).thumbs_up || {}).count || 0 }}
            </div>
            <div class="vr"/>
            <div
              @click="toggleReaction(reply.id, 'thumbs_down')"
              class="vote function f-mono">
              <i class="fa-thumbs-down" :class="((reply.summary.reactions || {}).thumbs_down || {}).activated ? 'fa' : 'fal'"/>{{ ((reply.summary.reactions || {}).thumbs_down || {}).count || 0 }}
            </div>
          </div>
        </div>
        <div
          @click="helpers.onClickHTMLContent"
          class="content"
          :class="{'deleted': reply.deletedAt}"
          v-html="reply.deletedAt ? $translate('DELETED_REPLY') : helpers.dom.linkify(reply.content)"
        />
        <div class="flex-row items-center flex-between">
          <div class="created-at" v-html="helpers.template.prettyTime(reply.createdAt, true)"/>
          <div class="reply-functions">
            <template v-if="helpers.logic.writing.canModify(reply)">
              <div
                @click="onClickDelete(reply)"
                class="reply-delete function">
                {{ $translate('DELETE') }}
              </div>
              <div class="vr"/>
            </template>
            <div
              @click="reply.$$showReply = !reply.$$showReply"
              class="reply-reply function">
              {{ $translate(reply.$$showReply ? 'CANCEL' : 'REPLY_REPLY') }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="reply.$$showReply"
        class="reply-write-container"
        :style="{'padding-left': `${depth * 24 + 24}px`}">
        <ReplyWrite :post="$store.getters.post" :parent="reply" @cancel="reply.$$showReply = false"/>
      </div>
      <CReplies :replies="reply.replies" :depth="depth + 1"/>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import communityService from '@/services/community'
import useGlobalHooks from '@/hooks/global-hooks'

const props = defineProps({
  replies: Array,
  depth: {
    type: Number,
    default: 0,
  },
})

const { helpers, store, router } = useGlobalHooks()

const repliesToDisplay = computed(() => (props.replies || []).filter(o => !o.deletedAt || hasNonDeletedChild(o)))

const hasNonDeletedChild = reply => {
  return (reply.replies || []).some(child => !child.deletedAt || hasNonDeletedChild(child))
}

const onConfirmDelete = async ({ id, password }) => {
  try {
    await communityService.remove.reply({ id, password })
    store.dispatch('loadPost', router.currentRoute.value.params.sharingKey)
    store.dispatch('loadPosts')
    helpers.toast.success('댓글을 삭제했습니다')
  } catch (e) {
    helpers.toast.error(e.data.message)
  }
}

const onClickDelete = async reply => {
  if (helpers.logic.writing.isMine(reply)) {
    const ok = await helpers.modal.confirm({ body: '내 댓글을 삭제하시겠습니까?' })
    if (ok) onConfirmDelete({ id: reply.id })
  } else {
    const password = await helpers.modal.input({ title: '댓글 비밀번호를 입력하세요', inputType: 'password', autocomplete: 'post-password' })
    if (password) onConfirmDelete({ id: reply.id, password })
  }
}

const toggleReaction = async (replyId, type) => {
  try {
    await communityService.toggleReaction.reply({
      replyId,
      type,
      nickname: ((store.getters.chatUser || {}).profile || {}).nickname,
    })
    store.dispatch('loadPost', store.getters.post.sharingKey)
  } catch (e) {}
}
</script>

<style lang="scss">
.c-replies {
  .reply {
    .content {
      padding: 8px 0;
      color: var(--text-stress);
      white-space: pre-line;

      &.deleted {
        color: var(--gs-88);
        font-style: italic;
      }

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
      align-items: center;
      justify-content: space-between;

      .reply-user {
        font-size: 13px;

        &:not(.authorized-clickable-nickname) {
          color: var(--text-light);
        }
      }
    }

    .reply-functions {
      display: flex;
      align-items: center;
      gap: 4px;

      .vr {
        height: 12px;
        width: 1px;
        background: var(--border-base);
      }

      .function {
        padding: 0 4px;
        cursor: pointer;

        &:hover {
          background: var(--background-light);
          border-radius: 4px;
        }
      }

      .vote {
        i {
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
