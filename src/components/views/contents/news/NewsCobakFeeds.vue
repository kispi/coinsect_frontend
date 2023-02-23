<template>
  <div class="news-cobak-feeds">
    <div class="feed-list">
      <a
        target="_blank"
        rel="noreferrer"
        class="feed-item"
        :class="{'important': feed.is_best}"
        :href="`https://cobak.co.kr/community/9/post/${feed.id}`"
        :key="feed.id"
        v-for="feed in data">
        <div class="feed-header">
          <div class="feed-publish-at" v-html="$helpers.dayjs(feed.updated_time).format('YYYY-MM-DD HH:mm:ss')"/>
          <div class="feed-title" v-html="feed.title"/>
        </div>
        <!-- 내용이나 이미지를 게제하면 저작권법 위반 -->
        <!-- <div class="feed-content" v-html="feed.contents"/>
        <img
          v-if="feed.contentImage"
          :src="feed.contentImage"
          class="feed-content-image"
        > -->
        </a>
      <div
        v-if="!loading && data.length === 0"
        class="news-empty center">
        아직 오늘자({{ params.current_time }}) 뉴스피드가 올라오지 않았어요 😅
      </div>
      <div
        v-if="loading"
        class="skeleton-container">
        <AppSkeleton
          :key="card"
          v-for="card in 4"
        />
      </div>
    </div>
    <PoweredBy :by="'cobak'" :link="'https://cobak.co.kr/news/breaking_news'" class="m-t-24"/>
  </div>
</template>

<script>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import contentService from '@/services/content'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { plugins, store } = useGlobalHooks()

    const interv = ref(null)

    const params = ref({
      page: 0,
      current_time: plugins.$helpers.dayjs().format('YYYY-MM-DD'),
    })

    const loading = ref(null)

    const data = ref([])

    const loadRecent = async () => {
      if (data.value.length === 0) return

      const recentId = data.value[0].id
      try {
        const respData = await contentService.news.feeds()
        const newFeeds = respData.slice(0, respData.findIndex(o => o.id === recentId))
        data.value = newFeeds.concat(data.value)
      } catch (e) {
        plugins.$toast.error(e.data.message)
      }
    }

    const loadNext = async () => {
      if (loading.value) return

      try {
        loading.value = true
        const respData = await contentService.news.feeds(params.value)
        if (respData.length === 0) {
          params.value.page = 0
          params.value.current_time = plugins.$helpers.dayjs(params.value.current_time).add(-1, 'days').format('YYYY-MM-DD')
          return
        }

        data.value = data.value.concat(respData)
        params.value.page++
      } catch (e) {
        plugins.$toast.error(e.data.message)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadNext()

      if (store.getters.isSSR) return

      interv.value = setInterval(loadRecent, 1000 * 60 * 5)
    })

    onUnmounted(() => {
      if (store.getters.isSSR) return

      clearInterval(interv.value)
    })

    watch(
      () => store.getters.scrollTop,
      () => {
        const feedItems = document.getElementsByClassName('feed-item')
        const lastFeedItem = feedItems[feedItems.length - 1]
        if (!lastFeedItem) return

        if (plugins.$helpers.dom.isElementInViewport(lastFeedItem, 50)) {
          loadNext()
        }
      },
    )

    return {
      data,
      params,
      loading,
    }
  },
}
</script>

<style lang="scss" scoped>
.news-cobak-feeds {
  position: relative;

  .feed-list {
    border: 1px solid var(--border-base);
  }

  .news-empty {
    padding: 80px 0;
    color: var(--text-stress);
    font-size: 16px;
  }

  .feed-item {
    position: relative;
    padding: 16px;
    display: block;
    cursor: pointer;

    &:hover {
      background: var(--background-light);
    }

    &.important {
      .feed-title {
        color: var(--brand-primary);
      }

      .feed-header {
        .feed-publish-at {
          color: var(--white);
          background: var(--brand-primary);
        }
      }
    }

    .feed-header {
      /* margin-bottom: 12px; */

      .feed-publish-at {
        margin-right: 8px;
        margin-bottom: 8px;
        white-space: nowrap;
        display: table;
        background: var(--background-light);
        color: var(--text-stress);
        padding: 2px 6px;
        font-size: 12px;
      }
    }

    .feed-title {
      font-weight: 700;
      font-size: 16px;
      color: var(--text-stress);
    }

    .feed-content {
      color: var(--text-stress);
    }

    .feed-content-image {
      margin-top: 16px;
      max-width: 100%;
    }

    &:not(:last-child) {
      border-bottom: 1px solid var(--border-base);
    }
  }

  .app-skeleton {
    height: 88px;
    border-radius: 0;
  }
}
</style>