<template>
  <div
    v-if="notices && posts"
    class="table-posts">
    <div class="table">
      <div
        :key="idx"
        v-for="(posts, idx) in [notices.data, posts.data]"
        class="posts-section"
        :class="{'notice': idx === 0}"><a
        draggable="false"
        class="row"
        :class="{
          'active': isActivePost(row),
          'notice': row.postType === 'notice',
        }"
        @click.prevent="onClickRow(row)"
        :href="`/community/${row.sharingKey}`"
        :key="row.id"
        v-for="row in posts">
        <AdaptiveLayout :gap="4" class="flex-fill">
          <div class="id-title flex-fill">
            <div
              v-if="!$store.getters.isMobile"
              class="cell number"
              v-html="postNumber(row)"
            />
            <article class="cell title">
              <PostImagePreview v-if="!$store.getters.isMobile" :post="row" class="m-r-8"/>
              <div v-html="row.title" class=""/>
              <div v-if="(row.replies || []).length > 0" class="num-replies"> [{{ (row.replies || []).length }}]</div>
            </article>
          </div>
          <div class="content">
            <div
              class="cell nickname"
              :class="{'authorized-clickable-nickname': row.userId}">
              <UserSymbol :user="row.user" class="flex-wrap m-r-4"/>
              <span @click.stop.prevent="onClickUserNickname(row)">{{ $helpers.template.writer(row) }}</span>
            </div>
            <div
              class="cell date f-mono">
              {{ $helpers.template.prettyTime(row.createdAt, true) }}
            </div>
            <div
              class="cell number f-mono">
              <span v-if="$store.getters.isMobile">조회</span> {{ row.views }}
            </div>
            <div
              class="cell number f-mono">
              <span v-if="$store.getters.isMobile">추천</span> {{ (row.reactions || []).filter(o => o.type === 'up').length }}
            </div>
          </div>
        </AdaptiveLayout>
        <PostImagePreview v-if="$store.getters.isMobile" :post="row"/>
      </a></div>
    </div>
    <AppPagination
      class="m-t-16 m-b-16"
      :page="payload.page"
      :limit="payload.limit"
      :total="$store.getters.posts.total"
      @page="onPage"
    />
    <div
      @click="() => {
        focus = true
        refInput.focus()
      }"
      class="input-wrapper search-bar"
      :class="{'focus': focus}">
      <i
        class="fal fa-search"
        :class="{'disabled': !payload.keyword}"
        @click.stop="loadPosts"
      />
      <input
        ref="refInput"
        placeholder="작성자, 글 제목, 내용 등"
        v-model="payload.keyword"
        @keydown="onKeydown"
        @click="focus = true"
        @blur="focus = false"
      >
      <i
        v-if="payload.keyword"
        class="fal fa-times"
        @click.stop="() => {
          payload.keyword = null
          refInput.focus()
        }"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, getCurrentInstance, onServerPrefetch, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import PostImagePreview from './PostImagePreview'

export default {
  components: { PostImagePreview },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const router = useRouter()

    const refInput = ref(null)

    const focus = ref(null)

    const payload = ref({
      page: parseInt(router.currentRoute.value.query.page || 1),
      limit: parseInt(router.currentRoute.value.query.limit || 20),
      keyword: router.currentRoute.value.query.keyword,
    })

    const posts = computed(() => store.getters.posts)

    const notices = computed(() => store.getters.notices)

    const onKeydown = e => {
      setTimeout(() => {
        payload.value.keyword = e.target.value
        if (e.key === 'Enter' && !e.isComposing) {
          payload.value.page = 1
          if (!payload.value.keyword) payload.value.limit = 20
          onPage(payload.value.page)
        }
      })
    }

    const isActivePost = row => router.currentRoute.value.params.sharingKey === row.sharingKey

    const postNumber = row => {
      if (row.postType === 'notice') return plugins.$translate('NOTICE')

      if (isActivePost(row)) return '<i class="fa fa-chevron-right"></i>'

      return row.id
    }

    const queryString = () => `${Object.keys(payload.value).filter(key => payload.value[key]).map(key => `${key}=${payload.value[key]}`).join('&')}`

    const onClickRow = row => {
      if (row.sharingKey === router.currentRoute.value.params.sharingKey) return

      router.push(`/community/${row.sharingKey}?${queryString()}`)
    }

    const onClickUserNickname = row => {
      if (!row.userId) {
        onClickRow(row)
        return
      }

      plugins.$modal.custom({ component: 'ModalUserStats', options: { user: row.user } })
    }

    const onPage = page => {
      payload.value.page = page
      router.push(`/community?${queryString()}`)
      setTimeout(loadPosts)
    }

    const loadPosts = async () => {
      await store.dispatch('loadPosts', {
        limit: payload.value.limit,
        offset: (payload.value.page - 1) * payload.value.limit,
        keyword: payload.value.keyword,
      })
      plugins.$helpers.dom.scrollToTop()
    }

    const callApi = async () => {
      await Promise.all([
        store.dispatch('loadNotices'),
        loadPosts(),
      ])
    }

    onMounted(callApi)

    onServerPrefetch(callApi)

    watch(
      () => router.currentRoute.value,
      newVal => {
        if (newVal.fullPath === '/community') {
          // 이건 아닌데...
          payload.value.page = 1
          payload.value.limit = 20
          payload.value.keyword = null
          loadPosts()
        }
      },
    )

    return {
      refInput,
      focus,
      payload,
      notices,
      posts,
      isActivePost,
      postNumber,
      onPage,
      loadPosts,
      onClickRow,
      onClickUserNickname,
      onKeydown,
    }
  },
}
</script>

<style lang="scss" scoped>
.table-posts {
  font-size: 12px;

  .table {
    border-top: 1px solid var(--text-stress);
    border-bottom: 1px solid var(--text-stress);
  }

  .posts-section {
    &.notice {
      border-bottom: 1px solid var(--text-stress);
      font-weight: 700;
    }
  }

  .row {
    padding: 8px;
    display: flex;
    cursor: pointer;

    &.active {
      background: var(--background-light);

      .title {
        font-weight: 700;
      }
    }

    &:hover {
      background: var(--background-light);
    }

    &:not(:last-child) {
      border-bottom: 1px solid var(--border-base);
    }

    &.header {
      display: flex;
      border-bottom: 1px solid var(--border-base);
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
      line-height: 1.5;
      color: var(--text-stress);

      .post-type {
        margin-right: 8px;
        color: var(--price-up-bybit);

        &.fa-exclamation-circle {
          color: var(--price-down-bybit);
        }
      }

      .num-replies {
        color: var(--gs-88);
        margin-left: 4px;
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
    align-items: center;
  }

  .id-title {
    flex: 1;

    article {
      display: flex;
      align-items: center;
    }
  }

  .search-bar {
    padding: 8px;
    border-radius: 4px;
    width: 240px;
    margin: auto;
    display: flex;
    align-items: center;

    input {
      margin: 0 8px;
      font-size: 16px;
    }

    .fa-search {
      &.disabled {
        opacity: 0.5;
        pointer-events: none;
      }
    }

    i {
      width: 32px;
      height: 32px;
      font-size: 16px;
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-stress);
      border-radius: 50%;
      cursor: pointer;
    }
  }

  .content {
    flex: initial;

    @media (max-width: 767px) {
      > *:not(:last-child) {
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