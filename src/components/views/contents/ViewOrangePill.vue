<template>
  <div class="view-orange-pill">
    <div class="section">
      <div class="no-select">What is <span @click="showOrangePill = !showOrangePill" class="orange text-underline cursor-pointer">Orange Pill</span> 💊?</div>
      <article
        v-show="showOrangePill"
        class="preface m-t-24">
        영화 '매트릭스'를 보면, 주인공 네오에게 모피어스는 빨간 약과 파란 약을 주며, 둘 중 하나를 선택하도록 한다.
        <a class="gray-box m-t-8 m-b-8" href="https://namu.wiki/w/%EB%AA%A8%ED%94%BC%EC%96%B4%EC%8A%A4" target="_blank">
          이번이 마지막 기회야. 이게 끝나면 돌이킬 수 없어. 파란 약을 먹으면, 이야기는 여기서 끝나. 자넨 잠에서 깨어 일상으로 되돌아가 믿고 싶은 걸 믿으며 살면 돼. 빨간 약을 먹으면, 이상한 나라에 남는다. 나는 토끼굴이 과연 어디까지 깊은지 보여줄 걸세. 명심하게. 난 자네에게 오직 진실만을 보여준다는 걸.
        </a>
        <ul>
          <li>비트코인의 세계에서는, 미국 달러를 위시해 1971년대 이래로 이어져온 신용화폐가 사실 거대한 사기극에 가까운 실패임을 깨닫고 비트코인이 진정한 의미의 돈임을 이해시키는 과정을 <span class="orange">Orange Pill 💊</span>이라고 한다. (오렌지 색 약을 먹임)</li>
          <li>왜 비트코인이 인류가 발견한 역사상 최고의 돈인지 타인들에게 알리고 계몽하는 비트코인 맥시멀리스트들이 여럿 있는데, 그 중에는 Max Keiser, Michael Saylor, Nayib Bukele 등이 있다.</li>
          <li>비트코인은 사상 첫 블록이 생성된 2009.01.03부터 지금까지 큰 변동성을 보이며 빠르게 성장해왔고, 그 변동성 때문에 많은 사람들에게 (좋게든 나쁘게든) 큰 인상을 주면서 성장해왔다.</li>
          <li>많은 유명인사들을 포함해 이 새로운 기술과 혁신에 대한 이해가 부족한 사람들은 '본질적 가치가 없다', '투기에 불과하다', '비트코인은 죽었다'라는 비판을 끊임없이 하고 있지만 비트코인은 그런 외부의 평가는 전혀 신경쓰지 않고 엄청난 속도로 계속 성장중이다.</li>
          <li>도대체 어떤 본질적 가치가 있기 때문에 죽지 않고 계속 성장하는 것일까? 사람들이 흔히 하는 질문들과 그에 대한 답변들을 모아보았다.</li>
        </ul>
      </article>
    </div>
    <div class="qna-items section">
      <div
        class="qna-item"
        :class="{'expanded': item.$$expanded}"
        :key="item.q"
        v-for="item in $store.getters.orangePill">
        <div
          @click="item.$$expanded = !item.$$expanded"
          class="question">{{ item.q }}<i class="fal" :class="item.$$expanded ? 'fa-chevron-up' : 'fa-chevron-down'"/>
        </div>
        <div
          v-show="item.$$expanded"
          @click="onClickAnswer"
          class="answer"
          v-html="item.a"
        />
      </div>
    </div>
    <div class="section">
      <div class="description">
        비트코인에 대한 조금 더 심도있는 공부를 원한다면, 엘 살바도르의 공식 비트코인 교재인
        <a href="https://d1085v6s0hknp1.cloudfront.net/files/bitcoin-diploma.pdf" target="_blank">비트코인 디플로마</a>
        (번역: <a href="https://twitter.com/atomicbtc/status/1576635586927947777" target="_blank">@atomicBTC</a>) 를 읽어보세요!
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onServerPrefetch } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { store } = useGlobalHooks()

    const showOrangePill = ref(null)

    const items = ref(null)

    const onClickAnswer = e => {
      const target = e.target
      if (target.src) {
        window.open(target.src, '_blank', 'noreferrer')
        return
      }
    }

    const callApi = async () => {
      try {
        await store.dispatch('loadOrangePill')
        items.value = store.getters.orangePill.map(o => ({ ...o, $$expanded: false }))
      } catch (e) {
        return Promise.reject(e)
      }
    }

    onMounted(callApi)

    onServerPrefetch(callApi)

    return {
      items,
      showOrangePill,
      onClickAnswer,
    }
  },
}
</script>

<style lang="scss">
.view-orange-pill {
  .orange {
    color: orange;
    font-weight: 700;
  }

  .preface {
    font-size: 12px;
    color: var(--text-stress);
    white-space: pre-line;

    .gray-box {
      border-radius: 4px;
      padding: 8px;
      background: var(--gs-e0);
      color: var(--black);
      display: block;
    }

    ul {
      padding-left: 16px;
    }

    li {
      list-style-type: disc;

      &:not(:last-child) {
        margin-bottom: 4px;
      }
    }
  }

  .qna-items {
    display: grid;
    align-items: flex-start;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 8px;

    .qna-item {
      background: var(--background-light);
      color: var(--text-stress);
      border-radius: 4px;
      border: 1px solid var(--border-base);
      box-shadow: 0 4px 8px rgba(64, 64, 64, 0.16);

      img {
        max-width: 100%;
      }

      .question {
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
      }

      .answer {
        border-top: 1px solid var(--border-base);
        padding: 8px;
        white-space: pre-line;

        img {
          cursor: pointer;
        }
      }

      &.expanded {
        .question {
          font-weight: 700;
        }
      }
    }
  }

  a {
    text-decoration: underline;
    color: var(--brand-primary);
  }

  .section {
    &:not(:last-child) {
      margin-bottom: 24px;
    }
  }

  @media (max-width: 767px) {
    .qna-items {
      .qna-item {
        .answer {
          font-size: 12px;
        }
      }
    }
  }
}
</style>