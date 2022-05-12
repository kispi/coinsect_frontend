<template>
  <div class="news-coinness-articles">
    <GoToTop :class="{'no-show': $store.getters.scrollTop <= 120}"/>
    <div class="filters">
      <button
        class="btn"
        :class="section === 'latest' ? 'btn-primary' : 'btn-default'"
        @click="section = 'latest'">
        최신뉴스
      </button>
      <button
        class="btn"
        :class="section === 'popularity' ? 'btn-primary' : 'btn-default'"
        @click="section = 'popularity'">
        많이 본 뉴스
      </button>
    </div>
    <div class="article-list">
      <a
        class="article-item"
        target="_blank"
        rel="noreferrer"
        :href="article.link"
        :key="article.id"
        v-for="article in data">
        <article>
          <div class="article-body">
            <div class="article-header">
              <div class="flex-row items-center m-b-8">
                <div class="article-publish-at flex-wrap" v-html="$helpers.dayjs(article.publishAt).format('YYYY-MM-DD HH:mm:ss')"/>
                <div
                  v-if="article.source"
                  class="article-source m-l-8"
                  v-html="$store.getters.translation.locale === 'en' ? article.source.nameEn : article.source.nameKo"
                />
              </div>
              <div class="article-title" v-html="article.title"/>
            </div>
            <div class="article-description lines-1" v-html="article.description"/>
          </div>
          <img
            v-if="article.thumbnailImage"
            :src="article.thumbnailImage"
          >
        </article>
      </a>
      <AppLoader v-if="loading" class="m-a"/>
    </div>
    <PoweredBy :by="'coinness'" :link="'https://coinness.live'" class="m-t-24"/>
  </div>
</template>

<script>
import { getCurrentInstance, ref, onMounted, watch, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import GoToTop from './GoToTop'
import contentService from '@/services/content'

export default {
  components: {
    GoToTop,
  },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const interv = ref(null)

    const lastId = ref(null)

    const loading = ref(null)

    const data = ref([])

    const section = ref('latest')

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
        const respData = await contentService.news.articles({
          lastId: lastId.value,
          section: section.value,
        })
        data.value = data.value.concat(respData)
        lastId.value = data.value[data.value.length - 1].id
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
      () => section.value,
      (newVal, oldVal) => {
        if (newVal === oldVal) return

        lastId.value = null
        data.value = []
        loadNext()
      },
    )

    return {
      data,
      section,
      loading,
    }
  },
}
</script>

<style lang="scss" scoped>
.news-coinness-articles {
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

  .article-item {
    display: block;
    position: relative;
    padding: 16px;
    cursor: pointer;

    &:hover {
      background: var(--brand-primary-hover-bg);
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

    .article-description {
      line-height: 22px;
      color: var(--text-stress);
    }

    &:not(:last-child) {
      border-bottom: 1px solid var(--border-base);
    }
  }

  .no-show {
    opacity: 0;
    pointer-events: none;
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