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
          <div class="ups">추천 {{ (post.reactions || []).length }}</div>
          <div class="replies">댓글 {{ post.$$numReplies }}</div>
        </div>
      </div>
      <div class="post-content" v-html="post.content"/>
      <div class="post-reactions">
        <div
          @click="toggleReaction('up')"
          class="up reaction-box">
          <div class="reaction-type">UP</div>
          <div class="value">{{ (post.reactions || []).filter(o => o.type === 'up').length }}</div></div>
        <div
          @click="toggleReaction('down')"
          class="down reaction-box">
          <div class="reaction-type">DOWN</div>
          <div class="value">{{ (post.reactions || []).filter(o => o.type === 'down').length }}</div></div>
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
        store.dispatch('loadPost', post.value.id)
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

<style lang="scss" scoped>
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
      font-size: 13px;
    }
  }

  .post-content {
    padding: 32px 0;
    white-space: pre-line;
  }

  .post-reactions {
    display: flex;
    justify-content: center;

    .reaction-box {
      width: 64px;
      height: 64px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--brand-primary);
      border-radius: 8px;

      &:not(:last-child) {
        margin-right: 8px;
      }

      &:hover {
        background: var(--brand-primary-hover-bg);
        cursor: pointer;
      }

      .value {
        font-weight: 700;
      }
    }
  }

  .reply-write {
    margin: 64px 0 32px;
  }
}
</style>