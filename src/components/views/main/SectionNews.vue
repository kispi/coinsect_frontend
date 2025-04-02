<template>
  <div
    v-if="news"
    class="section-news m-b-16">
    <div class="hor-scroll">
      <a
        @click.prevent="helpers.openLink(item.url)"
        class="item-news lines-1"
        :class="{'best': item.is_best}"
        :href="item.url"
        :key="item.id"
        v-for="item in news">
        <div class="timestamp">{{ helpers.dayjs((item || {}).created_at).format('HH:mm') }}</div>
        <div class="title lines-1">{{ (item || {}).title }}</div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UpbitNews } from '@/types'
import { computed } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

const { helpers, store } = useGlobalHooks()

const news = computed<UpbitNews[]>(() => (store.getters.dashboardsMain || {}).news)
</script>

<style lang="scss" scoped>
.section-news {
  animation: slide 40s linear infinite;

  .hor-scroll {
    display: flex;
    gap: 8px;
  }

  .item-news {
    padding: 8px;
    background: var(--background-light);
    display: flex;
    font-size: 12px;
    flex: 0 0 320px;
    border-radius: 4px;

    .timestamp {
      border: 1px solid var(--background-light);
      border-radius: 16px;
      background: var(--background-light);
      padding: 0 8px;
      white-space: nowrap;
    }

    .title {
      color: var(--text-stress);
      font-weight: 700;
      margin-left: 8px;
    }

    &:hover {
      background: var(--border-light);
    }

    &.best {
      .title {
        color: var(--warning);
      }

      .timestamp {
        background: var(--warning);
        color: var(--white);
      }
    }
  }

  @keyframes slide {
    // there are 10 news and gap is 8px
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(calc(320px * -10 + 8px * -10));
    }
  }
}
</style>