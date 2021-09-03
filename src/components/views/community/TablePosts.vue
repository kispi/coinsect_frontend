<template>
  <div class="table-posts">
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
      :gap="4"
      class="row"
      :key="row.id"
      v-for="row in resp.data">
      <div class="id-title">
        <div
          v-if="!$store.getters.isMobile"
          class="cell number">
          {{ row.id }}
        </div>
        <div
          class="cell title">
          {{ row.title }}<span v-if="(row.children || []) > 0" class="num-replies"> [{{ (row.children || []).length }}]</span>
        </div>
      </div>
      <div class="content">
        <div
          class="cell nickname">
          {{ row.nickname }}<span v-if="row.ip"> ({{ $helpers.template.ip(row.ip) }})</span>
        </div>
        <div
          class="cell date">
          {{ $helpers.dayjs(row.createdAt).format('MM-DD HH:mm:ss') }}
        </div>
        <div
          class="cell number">
          <span v-if="$store.getters.isMobile">조회</span> {{ row.views }}
        </div>
        <div
          class="cell number">
          <span v-if="$store.getters.isMobile">추천</span> {{ (row.reactions || []).length }}
        </div>
      </div>
    </AdaptiveLayout>
  </div>
</template>

<script>
import { onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import crudService from '@/services/crud'
import useTable from '@/hooks/table'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const { resp, params, onParams } = useTable('post')

    const router = useRouter()

    const loadPosts = async () => {
      try {
        resp.value = await crudService.post.all(params.value.build())
      } catch (e) {}
    }

    const onAction = ({ row, key, event }) => {
      router.push(`/posts/${row.id}`)
    }

    onMounted(() => {
      params.value = plugins.$helpers.qb().base().where('board_id = 1')
      loadPosts()
    })

    return {
      resp,
      params,
      onParams,
      onAction,
    }
  },
}
</script>

<style lang="scss" scoped>
.table-posts {
  border-top: 2px solid var(--brand-primary-hover-bg);
  border-bottom: 2px solid var(--brand-primary-hover-bg);
  font-size: 12px;

  .row {
    padding: 8px;
    cursor: pointer;

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
        width: initial !important;
      }
    }
  }
}
</style>