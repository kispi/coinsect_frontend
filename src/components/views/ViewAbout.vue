<template>
  <div class="view-about">
    <div class="description">
      <a
        :href="$helpers.useS3('og-images/og-image.png')"
        target="_blank">
        <AppImg :src="$helpers.useS3('og-images/og-image.png')" class="og-image"/>
      </a>
      <div class="m-b-8"><b>코인충</b>에 오신 것을 환영합니다. 코인충은 1인 프로젝트이며, 이 사이트만 켜놓으면 다른 어떤 사이트도 켜둘 필요가 없을 정도의 많은 정보 / 유틸리티들을 갖춘 사이트가 되는 것을 목표로 하고 있습니다.</div>
      <div class="m-b-8">항상 '굳이 다른 유명한 사이트들을 두고 이곳을 이용할 메리트가 있는가?'를 생각하며, 방문자분들의 편의성과 필요성을 최대한으로 고려합니다.</div>
      현재 제공하는 기능들로는
      <ul class="box">
        <li>업비트(원화, BTC) / 빗썸(원화) 실시간 코인 시세 및 김프</li>
        <li>업비트(원화, BTC) / 바이빗(USDT) 실시간 호가창 & 차트</li>
        <li>브라우저 타이틀에 현재 선택된 코인 가격 및 프리미엄 표시</li>
        <li>나스닥 / S&P 500 / 비트코인 도미넌스 / 김프 등의 트레이딩뷰 티커 프리셋</li>
        <li>비트멕스 리더보드 (워뇨띠 포지션)</li>
        <li>실시간 포지션 (박호두 / 짭구 등의 포지션을 바이빗 모바일 인터페이스로 보여줌)</li>
        <li>시가총액 (API: 코인마켓캡)</li>
        <li>뉴스 (API: 업비트 / 코인니스)</li>
        <li>코인 인플루언서들의 큐레이팅된 정보</li>
        <li>비트코인 보유단체 (MSTR, TSLA, Grayscale...)</li>
        <li>비트코인 다음 반감기까지의 카운터</li>
        <li>각종 미니 앱들: 실시간 포트폴리오 / 연봉 세전, 세후 계산기 등</li>
        <li>로그인이 필요없는 익명 커뮤니티 (자유 게시판) & 채팅</li>
      </ul>
      등이 있으며, 저 혼자 개발하는 사이트이기 때문에 게시판이나 채팅으로 의견을 남겨주시는 분들이 계시면 매우 빠르게 반영한다는 장점이 있습니다.<br><br>
    </div>
    <hr class="m-t-40">
    <div
      class="toggle-updates text-center"
      @click="showUpdates = !showUpdates">
      <i class="fa m-r-4" :class="showUpdates ? 'fa-chevron-up' : 'fa-chevron-down'"/>개발 히스토리
    </div>
    <transition name="slide-down">
      <div
        v-if="showUpdates"
        class="updates m-t-8">
        <ul
          :key="idx"
          v-for="(update, idx) in updates">
          <div class="date" v-html="update.date"/>
          <li
            class="disc m-l-16"
            :key="idx"
            v-for="(job, idx) in update.jobsDone"
            v-html="job">
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from 'vue'
import updates from './updates'

export default {
  setup() {
    const showUpdates = ref(null)

    return {
      updates,
      showUpdates,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-about {
  .og-image {
    display: block;
    max-width: 640px;
    margin: 0 auto 16px;
  }

  a {
    text-decoration: underline;
    color: var(--brand-primary);
  }

  li {
    list-style-type: square;
  }

  .description {
    font-size: 16px;
    line-height: 28px;
    color: var(--text-stress);

    ul {
      border: 1px solid var(--border-base);
      margin: 8px 0;
      padding: 16px 32px;

      li {
        font-size: 14px;
        line-height: 22px;
      }
    }
  }

  .toggle-updates {
    cursor: pointer;
  }

  .updates {
    ul {
      &:not(:last-child) {
        margin-bottom: 16px;
      }

      li {
        font-size: 12px;
        line-height: 18px;
      }
    }

    .date {
      color: var(--text-stress);
      margin-bottom: 4px;
      background: var(--border-base);
      padding: 2px 6px;
      font-size: 12px;
      display: table;
    }
  }
}
</style>