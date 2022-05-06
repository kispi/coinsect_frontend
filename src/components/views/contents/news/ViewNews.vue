<template>
  <div class="view-news">
    <div class="providers">
      <div class="options">
        <div
          class="provider"
          :class="{'selected': $store.getters.settings.newsProvider === 'upbit'}"
          @click="$store.commit('setSettings', { newsProvider: 'upbit' })">
          <img src="@/assets/images/upbit.svg">뉴스룸
        </div>
        <div
          class="provider"
          :class="{'selected': $store.getters.settings.newsProvider === 'coinness_feed'}"
          @click="$store.commit('setSettings', { newsProvider: 'coinness_feed' })">
          <img src="@/assets/images/coinness.svg">속보
        </div>
        <div
          class="provider"
          :class="{'selected': $store.getters.settings.newsProvider === 'coinness_article'}"
          @click="$store.commit('setSettings', { newsProvider: 'coinness_article' })">
          <img src="@/assets/images/coinness.svg">뉴스룸
        </div>
      </div>
    </div>
    <NewsUpbit v-if="$store.getters.settings.newsProvider === 'upbit'"/>
    <NewsCoinnessFeeds v-if="$store.getters.settings.newsProvider === 'coinness_feed'"/>
    <NewsCoinnessArticles v-if="$store.getters.settings.newsProvider === 'coinness_article'"/>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import NewsCoinnessArticles from './NewsCoinnessArticles'
import NewsCoinnessFeeds from './NewsCoinnessFeeds'
import NewsUpbit from './NewsUpbit'

export default {
  components: {
    NewsCoinnessArticles,
    NewsCoinnessFeeds,
    NewsUpbit,
  },
  setup() {
    const store = useStore()

    onMounted(() => {
      if (['upbit', 'coinness_feed', 'coinness_article'].indexOf(store.getters.settings.newsProvider) < 0) {
        store.commit('setSettings', { newsProvider: 'upbit' })
      }
    })
  },
}
</script>

<style lang="scss" scoped>
.view-news {
  .providers {
    display: table;
    margin-left: auto;
    margin-bottom: 16px;

    .options {
      display: flex;
      align-items: center;
    }

    .provider {
      border-radius: 4px;
      padding: 4px 8px;
      border: 1px solid var(--border-base);
      display: flex;
      align-items: center;
      cursor: pointer;

      &:not(:last-child) {
        margin-right: 8px;
      }

      &.selected {
        border: 1px solid var(--text-stress);
        color: var(--text-stress);
      }

      &:not(.selected) {
        opacity: 0.5;
      }

      img {
        width: 20px;
        margin-right: 4px;
      }
    }
  }
}
</style>