<template>
  <div class="news-cobak-articles">
    <div class="filters">
      <button
        class="btn"
        :class="params.news_type === 'recent_news' ? 'btn-primary' : 'btn-default'"
        @click="params.news_type = 'recent_news'">
        최신뉴스
      </button>
      <button
        class="btn"
        :class="params.news_type === 'best_news' ? 'btn-primary' : 'btn-default'"
        @click="params.news_type = 'best_news'">
        많이 본 뉴스
      </button>
    </div>
    <div class="article-list">
      <a
        class="article-item"
        target="_blank"
        rel="noreferrer noopener"
        :href="`https://cobak.co.kr/news/9/post/${article.id}`"
        :key="article.id"
        v-for="article in data">
        <article>
          <div class="article-body">
            <div class="article-header">
              <div class="flex-row items-center m-b-8">
                <div class="article-publish-at flex-wrap" v-html="$helpers.dayjs(article.updated_time).format('YYYY-MM-DD HH:mm:ss')"/>
                <div
                  v-if="article.user"
                  class="article-source m-l-8"
                  v-html="article.user.nickname"
                />
              </div>
              <div class="article-title" v-html="article.title"/>
            </div>
            <div class="article-contents lines-1" v-html="article.contents"/>
          </div>
          <!-- 이미지 게제시 저작권 침해 -->
          <!-- <AppImg
            v-if="(article.photos || []).length > 0"
            :src="article.photos[0].photo_url"
            :alt="article.title"
          /> -->
        </article>
      </a>
      <div
        v-if="!loading && data.length === 0"
        class="news-empty center">
        아직 오늘자({{ params.current_time }}) 뉴스가 올라오지 않았어요 😅
      </div>
      <AppLoader v-if="loading" class="m-a"/>
    </div>
    <PoweredBy :by="'cobak'" :link="'https://cobak.co.kr/news/home'" class="m-t-24"/>
  </div>
</template>

<script>
import { getCurrentInstance, ref, onMounted, watch, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import contentService from '@/services/content'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const interv = ref(null)

    const params = ref({
      news_type: 'recent_news',
      page: 0,
      current_time: plugins.$helpers.dayjs().format('YYYY-MM-DD'),
    })

    const loading = ref(null)

    const data = ref([])

    const loadRecent = async () => {
      if (data.value.length === 0) return

      const recentId = data.value[0].id
      try {
        const respData = await contentService.news.articles()
        const newArticles = respData.slice(0, respData.findIndex(o => o.id === recentId))
        data.value = newArticles.concat(data.value)
      } catch (e) {
        plugins.$toast.error(e.data.message)
      }
    }

    const loadNext = async () => {
      if (loading.value) return

      try {
        loading.value = true
        const respData = await contentService.news.articles(params.value)
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
        const articleItems = document.getElementsByClassName('article-item')
        const lastarticleItem = articleItems[articleItems.length - 1]
        if (!lastarticleItem) return

        if (plugins.$helpers.dom.isElementInViewport(lastarticleItem, 50)) {
          loadNext()
        }
      },
    )

    watch(
      () => params.value.news_type,
      (newVal, oldVal) => {
        if (newVal === oldVal) return

        data.value = []
        loadNext()
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
.news-cobak-articles {
  position: relative;

  .filters {
    display: flex;
    margin-bottom: 16px;

    button {
      font-weight: 500;

      &:not(:last-child) {
        margin-right: 8px;
      }
    }
  }

  .article-list {
    border: 1px solid var(--border-base);
  }

  .news-empty {
    padding: 80px 0;
    color: var(--text-stress);
    font-size: 16px;
  }

  .article-item {
    display: block;
    position: relative;
    padding: 16px;
    cursor: pointer;

    &:hover {
      background: var(--background-light);
    }

    .article-header {
      margin-bottom: 12px;

      .article-publish-at {
        white-space: nowrap;
        display: table;
        background: var(--background-light);
        color: var(--text-stress);
        padding: 2px 6px;
        font-size: 12px;
      }

      .article-source {
        font-size: 12px;
        color: var(--gs-88);
      }
    }

    article {
      display: flex;

      .article-body {
        flex: 1 1 0;
        min-width: 0;
      }

      img {
        border-radius: 4px;
      }
    }

    .article-title {
      font-weight: 700;
      font-size: 16px;
      line-height: 24px;
      color: var(--text-stress);
    }

    .article-contents {
      line-height: 22px;
      color: var(--text-stress);
    }

    &:not(:last-child) {
      border-bottom: 1px solid var(--border-base);
    }
  }

  @media (max-width: 479px) {
    article {
      flex-direction: column;
    }

    img {
      margin-top: 16px;
    }
  }

  @media (min-width: 480px) {
    img {
      margin-left: 16px;
      width: 120px;
      height: 84px;
      flex: 0 0 auto;
    }
  }
}
</style>