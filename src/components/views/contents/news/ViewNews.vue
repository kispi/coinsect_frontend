<template>
  <div class="view-news">
    <div class="providers">
      <div class="options">
        <div
          class="provider"
          :class="{'selected': $store.getters.settings.newsProvider === 'upbit'}"
          @click="$store.commit('setSettings', { newsProvider: 'upbit' })">
          <img src="@/assets/images/upbit.svg">UPBIT
        </div>
        <div
          class="provider"
          :class="{'selected': $store.getters.settings.newsProvider === 'coinness'}"
          @click="$store.commit('setSettings', { newsProvider: 'coinness' })">
          <img src="@/assets/images/coinness.svg">CoinNess
        </div>
      </div>
    </div>
    <NewsUpbit v-if="$store.getters.settings.newsProvider === 'upbit'"/>
    <NewsCoinness v-if="$store.getters.settings.newsProvider === 'coinness'"/>
  </div>
</template>

<script>
import { computed, onMounted, onServerPrefetch } from 'vue'
import { useStore } from 'vuex'
import NewsCoinness from './NewsCoinness'
import NewsUpbit from './NewsUpbit'

export default {
  components: {
    NewsCoinness,
    NewsUpbit,
  },
  setup() {
    const store = useStore()

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

    onServerPrefetch(loadNews)

    return {
      sections,
    }
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
      padding: 4px;
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