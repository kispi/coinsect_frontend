<template>
  <div
    v-if="notices && posts"
    class="table-posts">
    <div class="table">
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
      <a
        class="row"
        :class="{
          'active': isActivePost(row),
          'notice': row.postType === 'notice',
        }"
        @click.prevent="onClickRow(row)"
        :href="`/community/${row.sharingKey}`"
        :key="row.id"
        v-for="row in $store.getters.isMobile ? posts.data : [...notices.data, ...posts.data]">
        <AdaptiveLayout :gap="4">
          <div class="id-title">
            <div
              v-if="!$store.getters.isMobile"
              class="cell number"
              v-html="postNumber(row)"
            />
            <article class="cell title">
              {{ row.title }}<span v-if="(row.replies || []).length > 0" class="num-replies"> [{{ (row.replies || []).length }}]</span>
            </article>
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
      </a>
    </div>
    <TablePagination
      :limit="limit"
      :total="$store.getters.posts.total"
      :currentIndex="page"
      @page="loadPosts"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, getCurrentInstance, onServerPrefetch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import TablePagination from './TablePagination'

export default {
  components: { TablePagination },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const router = useRouter()

    const page = ref(0)

    const limit = ref(20)

    const posts = computed(() => store.getters.posts)

    const notices = computed(() => store.getters.notices)

    const isActivePost = row => parseInt(router.currentRoute.value.params.id) === row.id

    const postNumber = row => {
      if (row.postType === 'notice') return plugins.$translate('NOTICE')

      if (isActivePost(row)) return '<i class="fa fa-chevron-right"></i>'

      return row.id
    }

    const onClickRow = row => {
      router.push(`/community/${row.sharingKey}`)
    }

    const loadPosts = async p => {
      if (typeof p === 'number') page.value = p

      await store.dispatch('loadPosts', {
        limit: limit.value,
        offset: page.value * limit.value,
      })
    }

    onMounted(() => {
      store.dispatch('loadNotices')
      loadPosts()
    })

    watch(
      () => (store.getters.post || {}).id,
      () => loadPosts(),
    )

    onServerPrefetch(async () => {
      await Promise.all([
        store.dispatch('loadNotices'),
        loadPosts(),
      ])
    })

    return {
      page,
      limit,
      notices,
      posts,
      isActivePost,
      postNumber,
      loadPosts,
      onClickRow,
    }
  },
}
</script>

<style lang="scss" scoped>
.table-posts {
  font-size: 12px;

  .table {
    border-top: 1px solid var(--brand-primary-hover);
    border-bottom: 1px solid var(--brand-primary-hover);
  }

  .row {
    padding: 8px;
    display: block;
    cursor: pointer;

    &.active {
      background: var(--background-light);

      .title {
        text-decoration: underline;
      }
    }

    &.notice {
      font-weight: 700;
    }

    &:hover:not(.active) {
      background: var(--brand-primary-hover-bg);
    }

    &:not(:last-child) {
      border-bottom: 1px solid var(--border-base);
    }

    &.header {
      display: flex;
      border-bottom: 1px solid var(--brand-primary-hover);
    }

    .cell {
      @media (min-width: 768px) {
        text-align: center;

        &.number {
          width: 64px;
          flex: 0 0 auto;
          text-align: center;
        }

        &.nickname,
        &.date {
          width: 144px;
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
    align-items: baseline;
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

  .table-pagination {
    margin: 24px auto;
    display: table;
  }
}
</style>