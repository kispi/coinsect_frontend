<template>
  <div class="news-coinness-feeds">
    <GoToTop :class="{'no-show': $store.getters.scrollTop <= 120}"/>
    <div class="feed-list">
      <div
        class="feed-item"
        :class="{'important': feed.isImportant}"
        :key="feed.id"
        v-for="feed in data">
        <div class="feed-header">
          <div class="feed-publish-at" v-html="$helpers.dayjs(feed.publishAt).format('YYYY-MM-DD HH:mm:ss')"/>
          <div class="feed-title" v-html="feed.title"/>
        </div>
        <div class="feed-content" v-html="feed.content"/>
        <img
          v-if="feed.contentImage"
          :src="feed.contentImage"
          class="feed-content-image"
        >
        <div class="sentiment">
          <div class="bull c-price-up"><i class="fa fa-arrow-trend-up"/>Bull {{ feed.bull }}</div>
          <div class="bear c-price-down"><i class="fa fa-arrow-trend-down"/>Bear {{ feed.bear }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import GoToTop from './GoToTop'

export default {
  components: {
    GoToTop,
  },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const lastId = ref(null)

    const loading = ref(null)

    const data = ref([])

    const loadNext = async () => {
      if (loading.value) return

      try {
        loading.value = true
        const respData = await plugins.$http.get('contents/news/coinness/feeds', { params: { lastId: lastId.value } })
        data.value = data.value.concat(respData)
        lastId.value = data.value[data.value.length - 1].id
      } catch (e) {
        plugins.$toast.error(e.data.message)
      } finally {
        loading.value = false
      }
    }

    onMounted(loadNext)

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
    }
  },
}
</script>

<style lang="scss" scoped>
.news-coinness-feeds {
  .feed-list {
    border: 1px solid var(--border-base);
  }

  .feed-item {
    position: relative;
    padding: 16px;

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
      margin-bottom: 12px;

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
      line-height: 24px;
      color: var(--text-stress);
    }

    .feed-content {
      line-height: 22px;
      color: var(--text-stress);
    }

    .feed-content-image {
      margin-top: 16px;
      max-width: 100%;
    }

    .sentiment {
      display: flex;
      margin-top: 16px;
      font-size: 12px;

      .bull {
        margin-right: 24px;
      }

      i {
        margin-right: 4px;
      }
    }

    &:not(:last-child) {
      border-bottom: 1px solid var(--border-base);
    }
  }

  .no-show {
    opacity: 0;
    pointer-events: none;
  }
}
</style>