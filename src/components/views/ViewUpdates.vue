<template>
  <div class="view-updates">
    <ul
      :key="idx"
      v-for="(update, idx) in updates">
      <div class="date" v-html="update.date"/>
      <li
        :key="idx"
        v-for="(job, idx) in update.jobsDone"
        v-html="job">
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  setup() {
    const updates = [{
      date: '2021-08-11',
      jobsDone: [
        '서버 이전',
        '다크 모드 가시성 개선',
        '다크 모드 = bybit, 라이트 모드 = upbit로 확정',
      ],
    }, {
      date: '2021-08-02',
      jobsDone: [
        '불필요한 계산 & 렌더링 제거하여 성능 크게 개선',
      ],
    }, {
      date: '2021-07-31',
      jobsDone: [
        '색 감각 테스트 게임 추가',
      ],
    }, {
      date: '2021-07-30',
      jobsDone: [
        '코인 뒤집기 게임 추가',
      ],
    }, {
      date: '2021-07-28',
      jobsDone: [
        '욕설 필터링',
        '위로 스크롤 된 상태에서 채팅 왔을 때 자동 스크롤되지 않도록 변경',
        '위로 스크롤 된 상태에서 온 채팅을 카카오톡처럼 하단에 오버레이로 표시',
        '가격 정보들에 monospace 글꼴 사용',
      ],
    }, {
      date: '2021-07-27',
      jobsDone: [
        '오픈그래프 세팅',
      ],
    }, {
      date: '2021-07-25',
      jobsDone: [
        'Modal: 업비트 호가창 구현',
      ],
    }, {
      date: '2021-07-22',
      jobsDone: [
        '시총 정보에 Coingecko API 사용하도록 변경',
      ],
    }, {
      date: '2021-07-20',
      jobsDone: [
        '배포 및 SSL 세팅',
      ],
    }, {
      date: '2021-07-12',
      jobsDone: [
        '레포 생성',
      ],
    }]

    return {
      updates,
    }
  },
}
</script>

<style lang="scss">
.view-updates {
  padding: var(--app-default-page-padding);
  margin: auto;
  max-width: 992px;
  line-height: 18px;

  ul {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  .date {
    color: var(--text-stress);
    margin-bottom: 8px;
  }
}
</style>