<template>
  <div class="view-mmcrypto view-layout-default">
    <div class="page-title">MMCrypto Project V Combot Leaderboard</div>
    <div class="page-description">
      This page uses API crawling from <a href="https://combot.org/c/1664317137/l" target="_blank" class="text-underline c-text-stress">https://combot.org/c/1664317137/l</a> and shows cached result so fast.<br>
      My server caches the result every <b class="c-text-stress">30</b> secs, so if you're not hurry enough to check your rank in absolute REAL-TIME, you could just use this page, which is fast.
    </div>
    <div class="combot-result">
      <div
        class="row"
        :key="row.rank"
        v-for="row in data">
        <a :href="row.imgSrc" target="_blank">
          <img :src="row.imgSrc">
        </a>
        <div class="info">
          <div class="name">{{ row.rank }}. {{ row.name }}</div>
          <div class="level">Level {{ row.level }}</div>
          <div class="progress">
            <div class="overlay">{{ row.progress.current }} / {{ row.progress.total }}</div>
            <div class="fill" :style="{ width: `${row.progress.current * 100 / row.progress.total}%` }"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from 'vue'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const data = ref(null)

    const callApi = async () => {
      try {
        data.value = await plugins.$http.get('combot_results')
      } catch (e) {}
    }

    onMounted(callApi)

    return {
      data,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-mmcrypto {
  .page-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-stress);
  }

  .page-description {
    margin-top: 24px;
    line-height: 22px;
  }

  .combot-result {
    margin-top: 24px;
    display: grid;
    grid-gap: 16px;

    @media (min-width: 480px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }

    .row {
      display: flex;
      align-items: center;

      img {
        width: 48px;
        height: 48px;
        margin-right: 16px;
        border-radius: 50%;
      }

      .info {
        .name {
          color: var(--text-stress);
          font-weight: 700;
        }

        .progress {
          border: 1px solid var(--border-base);
          margin-top: 4px;
          width: 160px;
          height: 22px;
          position: relative;

          .overlay {
            padding: 2px;
            text-align: center;
            z-index: 1;
            font-weight: 500;
            color: var(--white);
          }

          .fill {
            background: var(--brand-primary-hover);
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
          }
        }
      }
    }
  }
}
</style>