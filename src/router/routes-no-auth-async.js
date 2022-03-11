import helpers from '@/helpers'
import useS3 from '@/helpers/s3'

const andSoOn = [{
  path: '/',
  component: () => import(/* webpackChunkName: 'view-home' */ '@/components/views/ViewHome'),
}, {
  path: '/login',
  component: () => import(/* webpackChunkName: 'view-login' */ '@/components/views/ViewLogin'),
}, {
  path: '/indicators/leaderboard',
  component: () => import(/* webpackChunkName: 'view-indicators' */ '@/components/views/indicators/ViewIndicators'),
  meta: {
    title: '비트멕스 리더보드 - 코인충',
    description: '워뇨띠, Mercury-Wood-Sprite, Skitter-Peridot-Raven, Bog-Pear-Weasel 등 유명 트레이더들의 포지션 등',
    image: useS3('og-images/og-image-leaderboard.png'),
  },
}, {
  path: '/indicators/real-time-positions',
  component: () => import(/* webpackChunkName: 'view-indicators' */ '@/components/views/indicators/ViewIndicators'),
  meta: {
    title: '실시간 포지션 - 코인충',
    description: '박호두, 짭구 등 방송인들의 실시간 포지션',
    image: useS3('og-images/og-image-real-time-prices.png'),
  },
}, {
  path: '/indicators/marketcaps',
  component: () => import(/* webpackChunkName: 'view-indicators' */ '@/components/views/indicators/ViewIndicators'),
  meta: {
    title: '시가총액 - 코인충',
    description: '비트코인, 이더리움, 리플, 솔라나 등의 시가총액',
  },
}, {
  path: '/indicators/general',
  component: () => import(/* webpackChunkName: 'view-indicators' */ '@/components/views/indicators/ViewIndicators'),
  meta: {
    title: '비트코인 지표 - 코인충',
    description: 'fear & greed, s2f, nlb price 등의 비트코인 가격 추이 예상에 사용되는 지표들',
  },
}, {
  path: '/contents/bitcoin-halving',
  component: () => import(/* webpackChunkName: 'view-bitcoin-halving' */ '@/components/views/contents/ViewContents'),
  meta: {
    title: '다음 비트코인 반감기 - 코인충',
    description: '다음 비트코인 반감기까지 남은 시간을 카운트다운으로 보여줍니다.',
  },
}, {
  path: '/contents/news',
  component: () => import(/* webpackChunkName: 'view-contents' */ '@/components/views/contents/ViewContents'),
  meta: {
    title: '코인 뉴스 - 코인충',
    description: '각종 암호화폐 / 코인 뉴스',
  },
}, {
  path: '/contents/influencers',
  component: () => import(/* webpackChunkName: 'view-contents' */ '@/components/views/contents/ViewContents'),
  meta: {
    title: '크립토 인플루언서 - 코인충',
    description: '유튜브나 트위터를 통해 활발하게 활동하는 크립토 / 경제 인플루언서들',
    image: useS3('og-images/og-image-influencers.png'),
  },
}, {
  path: '/contents/public-treasury',
  component: () => import(/* webpackChunkName: 'view-contents' */ '@/components/views/contents/ViewContents'),
  meta: {
    title: '비트코인 보유단체 - 코인충',
    description: '비트코인을 보유한 상장사들의 목록 및 보유 현황. 갈수록 많은 회사들이 현금 가치 하락에 대한 헤지로 비트코인을 자사의 재무재표에 추가할 것이다.',
    image: useS3('og-images/og-image-public-treasury.png'),
  },
}, {
  path: '/contents/:a/:b',
  component: () => import(/* webpackChunkName: 'view-contents' */ '@/components/views/contents/ViewContents'),
}, {
  path: '/community',
  component: () => import(/* webpackChunkName: 'view-community' */ '@/components/views/community/ViewCommunity'),
}, {
  path: '/community/write',
  component: () => import(/* webpackChunkName: 'view-post-write' */ '@/components/views/community/ViewPostWrite'),
}, {
  path: '/community/edit/:sharingKey',
  component: () => import(/* webpackChunkName: 'view-post-edit' */ '@/components/views/community/ViewPostEdit'),
}, {
  path: '/community/:sharingKey',
  component: () => import(/* webpackChunkName: 'view-post' */ '@/components/views/community/ViewPost'),
  name: 'ViewPost',
}, {
  path: '/games',
  component: () => import(/* webpackChunkName: 'view-games' */ '@/components/views/ViewGames'),
}, {
  path: '/portfolio',
  component: () => import(/* webpackChunkName: 'view-portfolio' */ '@/components/views/ViewPortfolio'),
}, {
  path: '/updates',
  component: () => import(/* webpackChunkName: 'view-updates' */ '@/components/views/ViewUpdates'),
}]

const routesNoAuth = [
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