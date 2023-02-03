import helpers from '@/helpers'
import withCdn from '@/helpers/s3'

const indicators = [{
  path: '/indicators/leaderboard',
  component: () => import(/* webpackChunkName: 'view-indicators' */ '@/components/views/indicators/ViewIndicators'),
  meta: {
    title: '비트멕스 리더보드 - 코인충',
    description: '워뇨띠, Mercury-Wood-Sprite, Skitter-Peridot-Raven, Bog-Pear-Weasel 등 유명 트레이더들의 포지션 등',
    image: withCdn('og-images/og-image-leaderboard.png'),
  },
}, {
  path: '/indicators/real-time-positions',
  component: () => import(/* webpackChunkName: 'view-indicators' */ '@/components/views/indicators/ViewIndicators'),
  meta: {
    title: '실시간 포지션 - 코인충',
    description: '박호두, 짭구 등 방송인들의 실시간 포지션',
    image: withCdn('og-images/og-image-streamer-positions.png'),
  },
}, {
  path: '/indicators/long-short',
  component: () => import(/* webpackChunkName: 'view-indicators' */ '@/components/views/indicators/ViewIndicators'),
  meta: {
    title: '롱-숏 비율 - 코인충',
    description: '코인의 거래소별 롱-숏 비율',
  },
}, {
  path: '/indicators/general',
  component: () => import(/* webpackChunkName: 'view-indicators' */ '@/components/views/indicators/ViewIndicators'),
  meta: {
    title: '비트코인 지표 - 코인충',
    description: 'fear & greed, s2f, nlb price 등의 비트코인 가격 추이 예상에 사용되는 지표들',
  },
}]

const markets = [{
  path: '/markets/crypto',
  component: () => import(/* webpackChunkName: 'view-markets' */ '@/components/views/markets/ViewMarkets'),
  meta: {
    title: '암호화폐 시총 - 코인충',
    description: '비트코인, 이더리움, 리플, 솔라나 등 코인, 암호화폐 시총',
  },
}, {
  path: '/markets/nasdaq',
  component: () => import(/* webpackChunkName: 'view-markets' */ '@/components/views/markets/ViewMarkets'),
  meta: {
    title: '나스닥 시총 - 코인충',
    description: '애플, 테슬라, 마이크로소프트 등 나스닥 종목들의 시총',
  },
}, {
  path: '/markets/kospi',
  component: () => import(/* webpackChunkName: 'view-markets' */ '@/components/views/markets/ViewMarkets'),
  meta: {
    title: '코스피 시총 - 코인충',
    description: '삼성전자, SK에너지솔루션 등 코스피 종목들의 시총'
  },
}, {
  path: '/markets/assets-including-metal',
  component: () => import(/* webpackChunkName: 'view-markets' */ '@/components/views/markets/ViewMarkets'),
  meta: {
    title: '귀금속 포함 시총 - 코인충',
    description: '금, 은, 팔라듐 등의 귀금속 및 비트코인, 이더리움 등을 포함한 시총 상위권 자산들의 목록',
  },
}]

const contents = [{
  path: '/contents/bitcoin-halving',
  component: () => import(/* webpackChunkName: 'view-contents' */ '@/components/views/contents/ViewContents'),
  meta: {
    title: '다음 비트코인 반감기 - 코인충',
    description: '다음 비트코인 반감기까지 남은 시간을 카운트다운으로 보여줍니다.',
    image: withCdn('og-images/og-image-bitcoin-halving.png')
  },
}, {
  path: '/contents/bitcoin-mining',
  component: () => import(/* webpackChunkName: 'view-contents' */ '@/components/views/contents/ViewContents'),
  meta: {
    title: '비트코인 채굴 / PoW 이해 - 코인충',
    description: '비트코인 채굴이란 무엇이며, 난이도란 무엇인지 알아봅니다.',
  },
}, {
  path: '/contents/news',
  component: () => import(/* webpackChunkName: 'view-contents' */ '@/components/views/contents/ViewContents'),
  meta: {
    title: '코인 뉴스 - 코인충',
    description: '각종 암호화폐 / 코인 뉴스',
  },
}, {
  path: '/contents/bitcoin',
  component: () => import(/* webpackChunkName: 'view-contents' */ '@/components/views/contents/ViewContents'),
  meta: {
    title: '비트코인 이해하기 - 코인충',
    description: '비트코인에 대해 흔히 하는 질문과 답변 - 코인충',
    image: 'https://i0.wp.com/armantheparman.com/wp-content/uploads/2021/07/1_AYiMl87vPeipby9H3l6jxg.png?fit=1200%2C579&ssl=1',
  },
}, {
  path: '/contents/crypto-referral',
  component: () => import(/* webpackChunkName: 'view-contents' */ '@/components/views/contents/ViewContents'),
  meta: {
    title: '레퍼럴 수익 계산기 - 코인충',
    description: '레퍼럴 가입 해야할까? 유명 인플루언서들은 레퍼럴로 얼마나 많은 수익을 올릴까?',
  },
}, {
  path: '/contents/economic-calendar',
  component: () => import(/* webpackChunkName: 'view-contents' */ '@/components/views/contents/ViewContents'),
  meta: {
    title: '경제 캘린더 - 코인충',
    description: 'FOMC, 금리 결정, 원유 재고 등 매매에 영향을 줄 수 있는 일정들을 모아둔 캘린더입니다.'
  },
}, {
  path: '/contents/twitter',
  component: () => import(/* webpackChunkName: 'view-contents' */ '@/components/views/contents/ViewContents'),
  meta: {
    title: '트위터 뉴스 - 코인충',
    description: '트위터는 뉴스 등의 전통 매체들보다 정보가 훨씬 빠릅니다. whale_alert를 비롯한 각종 코인 관련 트위터 계정들의 타임라인을 제공합니다.',
  },
}, {
  path: '/contents/influencers',
  component: () => import(/* webpackChunkName: 'view-contents' */ '@/components/views/contents/ViewContents'),
  meta: {
    title: '크립토 인플루언서 - 코인충',
    description: '유튜브나 트위터를 통해 활발하게 활동하는 크립토 / 경제 인플루언서들',
    image: withCdn('og-images/og-image-influencers.png'),
  },
}, {
  path: '/contents/public-treasury',
  component: () => import(/* webpackChunkName: 'view-contents' */ '@/components/views/contents/ViewContents'),
  meta: {
    title: '비트코인 보유단체 - 코인충',
    description: '비트코인을 보유한 상장사들의 목록 및 보유 현황. 갈수록 많은 회사들이 현금 가치 하락에 대한 헤지로 비트코인을 자사의 재무재표에 추가할 것이다.',
    image: withCdn('og-images/og-image-treasuries.png'),
  },
}, {
  path: '/contents/:a/:b',
  component: () => import(/* webpackChunkName: 'view-contents' */ '@/components/views/contents/ViewContents'),
}]

const onchain = [{
  path: '/onchain/richlist',
  component: () => import(/* webpackChunkName: 'view-onchain' */ '@/components/views/onchain/ViewOnchain'),
  meta: {
    title: '리치리스트 - 코인충',
    description: '암호화폐의 분포를 보여줍니다.',
    image: withCdn('og-images/og-image-richlist.png'),
  },
}, {
  path: '/onchain/whale-alert',
  component: () => import(/* webpackChunkName: 'view-onchain' */ '@/components/views/onchain/ViewWhaleAlert'),
  meta: {
    title: '고래 입금, 출금 - 코인충',
    description: 'Whale Alert API에 기반하여 최근에 일어난 큰 규모의 이체건들을 보여줍니다.',
  },
}]

const apps = [{
  path: '/apps/portfolio',
  component: () => import(/* webpackChunkName: 'view-apps' */ '@/components/views/apps/ViewApps'),
  meta: {
    title: '포트폴리오 - 코인충',
    description: '내 포트폴리오의 실시간 평가액을 보여줍니다.',
  },
}, {
  path: '/apps/salary',
  component: () => import(/* webpackChunkName: 'view-apps' */ '@/components/views/apps/ViewApps'),
  meta: {
    title: '연봉 실수령 계산기 - 코인충',
    description: '내 연봉 실수령액은 얼마일까? 비트코인으로 환산한 내 월급은?',
    image: withCdn('og-images/og-image-salary.png'),
  },
}, {
  path: '/apps/lottery',
  component: () => import(/* webpackChunkName: 'view-apps' */ '@/components/views/apps/ViewApps'),
  meta: {
    title: '로또 시뮬레이터 - 코인충',
    description: '통계적으로 볼 때 로또를 사는건 비합리적이라는 사실을 체험해봅니다.',
    image: withCdn('og-images/og-image-lottery.png'),
  },
}, {
  path: '/apps/image-resizer',
  component: () => import(/* webpackChunkName: 'view-apps' */ '@/components/views/apps/ViewImageResizer'),
  meta: {
    title: 'Image Resizer - 코인충',
    description: '용량이 큰 이미지를 jpg 형태로 압축하여 작은 용량으로 만들어줍니다.',
  },
}, {
  path: '/apps/image-moderation',
  component: () => import(/* webpackChunkName: 'view-apps' */ '@/components/views/apps/ViewImageModeration'),
  meta: {
    title: '민감한 이미지 분류 - 코인충',
    description: 'AWS Rekognition을 사용하여 부적절한 이미지를 감지해냅니다.',
  },
}, {
  path: '/apps/seo',
  component: () => import(/* webpackChunkName: 'view-apps' */ '@/components/views/apps/ViewApps'),
}, {
  path: '/apps/games',
  component: () => import(/* webpackChunkName: 'view-apps' */ '@/components/views/apps/ViewApps'),
}, {
  path: '/apps/voice-recorder',
  component: () => import(/* webpackChunkName: 'view-apps' */ '@/components/views/apps/ViewApps'),
}]

const community = [{
  path: '/community',
  component: () => import(/* webpackChunkName: 'view-community' */ '@/components/views/community/ViewCommunity'),
}, {
  path: '/community/write',
  component: () => import(/* webpackChunkName: 'view-community' */ '@/components/views/community/ViewPostWrite'),
}, {
  path: '/community/edit/:sharingKey',
  component: () => import(/* webpackChunkName: 'view-community' */ '@/components/views/community/ViewPostEdit'),
}, {
  path: '/community/:sharingKey',
  component: () => import(/* webpackChunkName: 'view-community' */ '@/components/views/community/ViewCommunity'),
}]

const andSoOn = [{
  path: '/',
  component: () => import(/* webpackChunkName: 'view-home' */ '@/components/views/ViewHome'),
}, {
  path: '/about',
  component: () => import(/* webpackChunkName: 'view-about' */ '@/components/views/ViewAbout'),
}]

const routesNoAuth = [
  ...indicators,
  ...markets,
  ...contents,
  ...onchain,
  ...apps,
  ...community,
  ...andSoOn,
].map(o => {
  o.beforeEnter = (to, from) => {
    if ((from || {}).fullPath && (to || {}).fullPath === '/login') {
      helpers.localStorage.setMeta('prevFullPath', from.fullPath)
    }
  }
  return o
})

export default routesNoAuth