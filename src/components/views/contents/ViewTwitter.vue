<template>
  <div class="view-twitter">
    <div class="description">
      트위터는 뉴스들에 비해 소식이 매우 빠릅니다. 트레이더라면 수익률에 큰 영향을 주는 정보의 속도에서 우위를 차지하여 이득을 볼 수 있고, 투자자라면 크립토 필드의 많은 인플루언서들의 생각을 읽으며 펀더멘털에 대한 이해를 높일 수 있습니다.
    </div>
    <div class="twitter-grid">
      <TwitterTimeline
        :account="account.id"
        :key="account.id"
        :height="640"
        v-for="account in accounts"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const accounts = ref([
      { title: 'Whale Alert', id: 'whale_alert' },
      { title: 'Elon Musk', id: 'elonmusk' },
      { title: 'Michael Saylor', id: 'saylor' },
      { title: 'CZ', id: 'cz_binance' },
      { title: 'PlanB', id: '100trillionUSD' },
      { title: 'Robert Kiyosaki', id: 'theRealKiyosaki' },
      { title: 'Dan Held', id: 'danheld' },
      { title: 'Benjamin Cowen', id: 'intocryptoverse' },
      { title: 'Bitcoin Archive', id: 'BTC_Archive' },
      { title: 'Max Keiser', id: 'maxkeiser' },
      { title: 'Peter Schiff', id: 'PeterSchiff' },
      { title: 'Will Clemente', id: 'WClementeIII' },
    ])

    return {
      accounts,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-twitter {
  .description {
    line-height: 22px;
    margin-bottom: 40px;
  }

  .twitter-grid {
    display: grid;
    grid-gap: 24px;
  }

  @media (min-width: 768px) {
    .twitter-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 992px) {
    .twitter-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>