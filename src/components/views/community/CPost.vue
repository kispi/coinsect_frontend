<template>
  <article
    v-if="post"
    class="c-post">
    <div class="post-section-body">
      <div class="post-header">
        <div class="post-title">
          <span class="badge-post-type m-r-8">{{ post.board.description}}</span>
          <span>{{ post.title }}</span>
        </div>
        <div class="writer-and-created-at">
          <div class="writer" :class="{'authorized-clickable-nickname': post.userId}">
            <UserSymbol :user="post.user" class="m-r-4"/>
            <span
              @click="post.userId ?
                $modal.custom({ component: 'ModalUserStats', options: { user: post.user } }) :
                null
              ">
              {{ $helpers.template.writer(post) }}
            </span>
          </div>
          <div class="created-at" v-html="$helpers.template.prettyTime(post.createdAt)"/>
        </div>
        <div class="numbers">
          <div class="views">조회 {{ post.views }}</div>
          <div class="ups">추천 {{ ((post.summary.reactions || {}).thumbs_up || {}).count || 0 }}</div>
          <div class="replies">댓글 {{ post.summary.numReplies }}</div>
        </div>
      </div>
      <div
        @click.prevent="$helpers.onClickHTMLContent"
        class="post-content"
        v-html="post.content"
      />
      <div class="post-reactions">
        <div
          @click="toggleReaction('thumbs_up')"
          class="reaction-box">
          <i class="fa-thumbs-up" :class="((post.summary.reactions || {}).thumbs_up || {}).activated ? 'fa' : 'fal'"/>
          <div class="value">{{ ((post.summary.reactions || {}).thumbs_up || {}).count || 0 }}</div>
        </div>
        <div
          @click="toggleReaction('thumbs_down')"
          class="reaction-box">
          <i class="fa-thumbs-down" :class="((post.summary.reactions || {}).thumbs_down || {}).activated ? 'fa' : 'fal'"/>
          <div class="value">{{ ((post.summary.reactions || {}).thumbs_down || {}).count || 0 }}</div>
        </div>
      </div>
    </div>
    <div class="post-section-replies">
      <div class="header">댓글 <span class="c-brand-primary f-700">[{{ post.summary.numReplies }}]</span></div>
      <CReplies :replies="post.replies"/>
      <ReplyWrite :post="post"/>
    </div>
  </article>
</template>

<script>
import { computed } from 'vue'
import communityService from '@/services/community'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { store } = useGlobalHooks()

    const post = computed(() => store.getters.post)

    const toggleReaction = async type => {
      try {
        await communityService.toggleReaction.post({
          postId: post.value.id,
          type,
          nickname: ((store.getters.chatUser || {}).profile || {}).nickname,
        })
        store.dispatch('loadPost', post.value.sharingKey)
        store.dispatch('loadPosts')
      } catch (e) {}
    }

    return {
      post,
      toggleReaction,
    }
  },
}
</script>

<style lang="scss">
.c-post {
  font-size: 13px;

  @mixin drawRightBorder {
    margin-right: 8px;
    padding-right: 8px;
    border-right: 1px solid var(--border-base);
  }

  .post-section-body {
    border-top: 1px solid var(--border-base);
    border-bottom: 1px solid var(--border-base);
    padding-bottom: 8px;
  }

  .post-section-replies {
    .header {
      padding: 8px 0;
      border-bottom: 1px solid var(--border-base);
    }
  }

  .post-header {
    padding: 8px 0;
    border-bottom: 1px solid var(--border-base);

    .post-title {
      font-weight: 700;
      color: var(--text-stress);
    }

    .writer-and-created-at {
      padding: 8px 0;

      .writer {
        @include drawRightBorder();
      }
    }

    .numbers {
      > * {
        &:not(:last-child) {
          @include drawRightBorder();
        }
      }
    }

    .writer-and-created-at,
    .numbers {
      display: flex;
      align-items: center;
      font-size: 13px;
    }
  }

  .post-content {
    padding: 32px 0;
    max-width: 100%;
    white-space: pre-line;

    img,
    iframe {
      max-width: 100%;
      cursor: pointer;
    }

    a {
      text-decoration: underline;
    }
  }

  .post-reactions {
    display: flex;
    justify-content: center;

    .reaction-box {
      width: 64px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-transform: uppercase;
      border: 1px solid var(--border-base);

      &:not(:last-child) {
        margin-right: 8px;
      }

      &:hover {
        cursor: pointer;
      }

      .value {
        font-weight: 700;
        margin-top: 4px;
      }
    }
  }
}
</style>
