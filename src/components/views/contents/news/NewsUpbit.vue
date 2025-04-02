<template>
  <div class="news-upbit">
    <AdaptiveLayout :gap="40">
      <div
        class="news-section"
        :key="section.title"
        v-for="section in sections">
        <div class="section-title" v-html="helpers.translate(section.title)"/>
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
              <div class="news-timestamp" v-html="helpers.template.elapsedTime(news.created_at)"/>
            </div>
            <div class="news-title" v-html="news.title"/>
          </a>
        </div>
      </div>
    </AdaptiveLayout>
    <PoweredBy :by="'upbit'" :link="'https://upbit.com/trends'" class="m-t-24"/>
  </div>
</template>

<script setup lang="ts">
import { UpbitNews } from '@/types'
import { ref, computed, onMounted } from 'vue'
import contentService from '@/services/content'
import useGlobalHooks from '@/hooks/global-hooks'

const { helpers } = useGlobalHooks()

const upbitNews = ref<{
  data: {
    featured_list: UpbitNews[]
    list: UpbitNews[]
  }
} | null>(null)

const sections = computed(() => {
  if (!upbitNews.value) return

  return [{
    title: 'FEATURED_NEWS',
    list: upbitNews.value.data.featured_list,
  }, {
    title: 'NEWS',
    list: upbitNews.value.data.list,
  }]
})

const loadNews = async () => {
  try {
    upbitNews.value = await contentService.news.upbit()
  } catch (e) {}
}

onMounted(loadNews)
</script>

<style lang="scss" scoped>
.news-upbit {
  .section-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-stress);
    margin-bottom: 16px;
  }

  .news-list-box {
    border-radius: 8px;
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
        background: var(--background-light);
      }
    }
  }
}
</style>