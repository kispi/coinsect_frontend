<template>
  <div
    v-if="(replies || []).length > 0"
    class="c-replies"
    :class="`depth-${depth}`">
    <div
      class="reply"
      :key="reply.id"
      v-for="reply in replies">
      <div class="reply-body">
        <div class="writer" v-html="$helpers.template.writer(reply)"/>
        <div class="content" v-html="reply.content"/>
        <div class="created-at" v-html="$helpers.template.prettyTime(reply.createdAt, true)"/>
      </div>
      <CReplies :replies="reply.replies" :depth="depth + 1"/>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'

export default {
  props: {
    replies: Array,
    depth: {
      type: Number,
      default: 0,
    }
  },
  setup(props) {
    onMounted(() => {
      console.log(props.replies)
    })
  }
}
</script>

<style lang="scss" scoped>
.c-replies {
  font-size: 13px;

  .reply {
    .content {
      padding: 4px 0;
    }

    .writer,
    .content {
      color: var(--text-stress);
    }

    .created-at {
      color: var(--gs-88);
      font-size: 12px;
    }

    .reply-body {
      border-bottom: 1px solid var(--border-base);
      padding: 8px 0;

      @media (min-width: 768px) {
        display: flex;
      }
    }
  }

  &.depth-1 {
    .reply-body {
      padding-left: 12px;
    }
  }

  &.depth-2 {
    .reply-body {
      padding-left: 24px;
    }
  }
}
</style>