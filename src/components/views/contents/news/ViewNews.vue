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
          :class="{'selected': $store.getters.settings.newsProvider === 'cobak_feed'}"
          @click="$store.commit('setSettings', { newsProvider: 'cobak_feed' })">
          <img src="@/assets/images/cobak.png">속보
        </div>
        <div
          class="provider"
          :class="{'selected': $store.getters.settings.newsProvider === 'cobak_article'}"
          @click="$store.commit('setSettings', { newsProvider: 'cobak_article' })">
          <img src="@/assets/images/cobak.png">뉴스룸
        </div>
      </div>
    </div>
    <NewsUpbit v-if="$store.getters.settings.newsProvider === 'upbit'"/>
    <NewsCobakFeeds v-if="$store.getters.settings.newsProvider === 'cobak_feed'"/>
    <NewsCobakArticles v-if="$store.getters.settings.newsProvider === 'cobak_article'"/>
  </div>
</template>

<script>
import NewsCobakArticles from './NewsCobakArticles'
import NewsCobakFeeds from './NewsCobakFeeds'
import NewsUpbit from './NewsUpbit'

export default {
  components: {
    NewsCobakArticles,
    NewsCobakFeeds,
    NewsUpbit,
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