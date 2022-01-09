<template>
  <div class="view-news">
    <PoweredBy :by="'upbit'" class="m-b-24"/>
    <AdaptiveLayout :gap="40" :boundaryWidth="1200">
      <div
        class="news-section"
        :key="section.title"
        v-for="section in sections">
        <div class="section-title" v-html="$translate(section.title)"/>
        <div class="news-list-box">
          <a
            :href="news.url"
            target="_blank"
            rel="noreferrer"
            class="news-item"
            :key="news.id"
            v-for="news in section.list">
            <div class="news-header">
              <div class="news-company" v-html="news.company"/>
              <div class="news-timestamp" v-html="diff(news.created_at)"/>
            </div>
            <div class="news-title" v-html="news.title"/>
          </a>
        </div>
      </div>
    </AdaptiveLayout>
  </div>
</template>

<script>
import { computed, getCurrentInstance, onMounted, onServerPrefetch } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const diff = timestamp => {
      const d = plugins.$helpers.dayjs().diff(plugins.$helpers.dayjs(timestamp), 'seconds')
      if (d > 86400) return `${Math.floor(d / 86400)}일 전`

      if (d > 3600) return `${Math.floor(d / 3600)}시간 전`

      if (d > 60) return `${Math.floor(d / 60)}분 전`
    }

    const sections = computed(() => {
      if (!store.getters.news) return

      return [{
        title: 'FEATURED_NEWS',
        list: store.getters.news.data.featured_list,
      }, {
        title: 'NEWS',
        list: store.getters.news.data.list,
      }]
    })

    const loadNews = async () => {
      try {
        await store.dispatch('loadNews')
      } catch (e) {}
    }

    onMounted(loadNews)

    onServerPrefetch(async () => await loadNews())

    return {
      sections,
      diff,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-news {
  .section-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-stress);
    margin-bottom: 16px;
  }

  .news-list-box {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);
    border-radius: 16px;
    overflow: hidden;
    background: var(--background-light);

    .news-item {
      display: block;
      padding: 12px;
      cursor: pointer;

      .news-header {
        display: flex;
        align-items: baseline;
        font-size: 12px;

        .news-timestamp {
          margin-left: 8px;
        }
      }
      
      .news-title {
        color: var(--text-stress);
        margin-top: 4px;
      }

      &:not(:last-child) {
        border-bottom: 1px solid var(--border-base);
      }

      &:hover {
        background: var(--border-base);
      }
    }
  }
}
</style>