<template>
  <div
    v-if="posts"
    class="table-posts">
    <div
      v-if="!$store.getters.isMobile"
      class="row header">
      <div v-if="!$store.getters.isMobile" class="cell number">번호</div>
      <div class="cell title">제목</div>
      <div class="cell nickname">글쓴이</div>
      <div class="cell date">작성일</div>
      <div class="cell number">조회</div>
      <div class="cell number">추천</div>
    </div>
    <AdaptiveLayout
      @click="onClickRow(row)"
      :gap="4"
      class="row"
      :class="{'active': parseInt($router.currentRoute.value.params.id) === row.id}"
      :key="row.id"
      v-for="row in posts.data">
      <div class="id-title">
        <div
          v-if="!$store.getters.isMobile"
          class="cell number">
          {{ row.id }}
        </div>
        <div class="cell title">
          {{ row.title }}<span v-if="(row.replies || []).length > 0" class="num-replies"> [{{ (row.replies || []).length }}]</span>
        </div>
      </div>
      <div class="content">
        <div
          class="cell nickname"
          v-html="$helpers.template.writer(row)"
        />
        <div
          class="cell date">
          {{ $helpers.template.prettyTime(row.createdAt, true) }}
        </div>
        <div
          class="cell number">
          <span v-if="$store.getters.isMobile">조회</span> {{ row.views }}
        </div>
        <div
          class="cell number">
          <span v-if="$store.getters.isMobile">추천</span> {{ (row.reactions || []).filter(o => o.type === 'up').length }}
        </div>
      </div>
    </AdaptiveLayout>
  </div>
</template>

<script>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const router = useRouter()

    const posts = computed(() => store.getters.posts)

    const onClickRow = row => {
      router.push(`/community/${row.id}`)
    }

    onMounted(() => {
      store.dispatch('loadPosts')
    })

    return {
      posts,
      onClickRow,
    }
  },
}
</script>

<style lang="scss" scoped>
.table-posts {
  border-top: 2px solid var(--brand-primary-hover);
  border-bottom: 2px solid var(--brand-primary-hover);
  font-size: 12px;

  .row {
    padding: 8px;
    cursor: pointer;

    &.adaptive-layout {
      &.active {
        font-weight: 700;
        background: var(--background-light);
      }

      &:hover:not(.active) {
        background: var(--brand-primary-hover-bg);
      }
    }

    &:not(:last-child) {
      border-bottom: 1px solid var(--border-base);
    }

    &.header {
      display: flex;
      border-bottom: 2px solid var(--brand-primary-hover-bg);
    }

    .cell {
      @media (min-width: 768px) {
        text-align: center;

        &.number {
          width: 40px;
          flex: 0 0 auto;
          text-align: center;
        }

        &.nickname,
        &.date {
          width: 96px;
          flex: 0 0 auto;
        }
      }
    }

    .title {
      flex: 1;
      color: var(--text-stress);

      .num-replies {
        color: var(--brand-primary);
      }
    }

    &:not(.header) {
      .title {
        text-align: initial;
      }
    }
  }

  .id-title,
  .content {
    display: flex;
  }

  .id-title {
    flex: 1;
  }

  .content {
    flex: initial;

    @media (max-width: 767px) {
      > * {
        padding-right: 8px;
        margin-right: 8px;
        border-right: 1px solid var(--border-base);
      }
    }
  }
}
</style>