<template>
  <article
    v-if="post"
    class="c-post">
    <div class="post-section-body">
      <div class="post-header">
        <div class="post-title" v-html="post.title"/>
        <div class="writer-and-created-at">
          <div class="writer" v-html="$helpers.template.writer(post)"/>
          <div class="created-at" v-html="$helpers.template.prettyTime(post.createdAt)"/>
        </div>
        <div class="numbers">
          <div class="views">조회 {{ post.views }}</div>
          <div class="ups">추천 {{ ((post.$$reactions || {}).up || {}).count || 0 }}</div>
          <div class="replies">댓글 {{ post.$$numReplies }}</div>
        </div>
      </div>
      <div class="post-content" v-html="post.content"/>
      <div class="post-reactions">
        <div
          @click="toggleReaction(rType)"
          class="reaction-box"
          :class="{'activated': ((post.$$reactions || {})[rType] || {}).activated}"
          :key="rType"
          v-for="rType in ['up', 'down']">
          <div class="reaction-type">{{ rType }}</div>
          <div class="value">{{ ((post.$$reactions || {})[rType] || {}).count || 0 }}</div>
        </div>
      </div>
    </div>
    <div class="post-section-replies">
      <div class="header">댓글 <span class="c-brand-primary f-700">[{{ post.$$numReplies }}]</span></div>
      <CReplies :replies="post.replies"/>
      <ReplyWrite :post="post"/>
    </div>
  </article>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import communityService from '@/services/community'

export default {
  setup() {
    const store = useStore()

    const post = computed(() => store.getters.post)

    const toggleReaction = async type => {
      try {
        await communityService.toggleReaction(post.value.id, type)
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
      align-items: flex-end;
      font-size: 13px;
    }
  }

  .post-content {
    padding: 32px 0;
    max-width: 100%;

    img {
      max-width: 100%;
    }
  }

  .post-reactions {
    display: flex;
    justify-content: center;

    .reaction-box {
      width: 64px;
      height: 48px;
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

      &.activated {
        border: 1px solid var(--brand-primary);
      }

      .value {
        font-weight: 700;
      }
    }
  }

  .reply-write {
    margin: 8px 0;
    border: 1px solid var(--brand-primary);
  }
}
</style>