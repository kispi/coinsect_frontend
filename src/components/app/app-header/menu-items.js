import { ref } from 'vue'

const useMenuItems = () => {
  const menuItems = ref([{
    title: 'HOME',
    path: '/',
    img: 'https://coinsect.io/favicon/logo.png',
  }, {
    title: 'KIMP',
    path: '/prices',
    img: 'https://theme.zdassets.com/theme_assets/9190474/3941022f7857ffa2b0ac3cb9165aec2c2e4a4e89.jpg',
  }, {
    title: 'COMMUNITY',
    pathPrefix: '/community',
    path: '/community',
    img: 'https://cdn-icons-png.flaticon.com/512/1946/1946355.png',
  }, {
    title: 'INDICATORS',
    pathPrefix: '/indicators/',
    subItems: [
      { path: '/indicators/real-time-positions', title: 'REAL_TIME_POSITIONS', img: 'https://d1085v6s0hknp1.cloudfront.net/assets/icon-jg.jpg' },
      { path: '/indicators/leaderboard', title: 'BITMEX_LEADERBOARD', img: 'https://d1085v6s0hknp1.cloudfront.net/images/exchanges/BITMEX.png' },
      { path: '/indicators/whale-alert', title: 'WHALE_ALERT', img: 'https://d1085v6s0hknp1.cloudfront.net/assets/icon-whalealert.jpg' },
      { path: '/indicators/richlist', title: 'RICHLIST', emoji: '🐳' },
    ],
    $$expanded: true,
    emoji: '📊',
  }, {
    title: 'NEWS_AND_CONTENTS',
    pathPrefix: '/contents/',
    subItems: [
      { path: '/contents/news', title: 'NEWS', emoji: '📰' },
      { path: '/contents/economic-calendar', title: 'ECONOMIC_CALENDAR', img: 'https://d1085v6s0hknp1.cloudfront.net/assets/icon-investing.jpg' },
      { path: '/contents/public-treasury', title: 'PUBLIC_TREASURY', img: 'https://g.foolcdn.com/art/companylogos/square/mstr.png' },
      { path: '/contents/influencers', title: 'INFLUENCERS', img: 'https://pbs.twimg.com/profile_images/1485632175932383235/8t0DGo6V_400x400.jpg' },
      { path: '/contents/crypto-referral', title: 'CRYPTO_REFERRAL', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEw91p80xgQe4acv2JsriSrnsghx7kuXGjjqI7wF1Rvs--GOi5LfPb0XcY6Zabv8xWzTs&usqp=CAU' },
    ],
    $$expanded: true,
    img: 'https://cdn.cms-twdigitalassets.com/content/dam/help-twitter/twitter_logo_blue.png.twimg.768.png',
  }, {
    title: 'MARKETS',
    pathPrefix: '/markets/',
    subItems: [
      { path: '/markets/crypto', title: 'CRYPTO', emoji: '₿' },
      { path: '/markets/nasdaq', title: 'NASDAQ', img: 'https://yt3.googleusercontent.com/ytc/AGIKgqMZKdfkx5yIMjtGEuX6jPQA_NIqwwbpfq1MdhRDNw=s900-c-k-c0x00ffffff-no-rj' },
      { path: '/markets/kospi', title: 'KOSPI', img: 'https://www.samsung.com/sec/static/etc/designs/smg/global/imgs/logo-square-letter.png' },
      { path: '/markets/assets-including-metal', title: 'ASSETS_INCLUDING_METAL', img: 'https://cdn-icons-png.flaticon.com/512/199/199541.png' },
    ],
    $$expanded: true,
    img: 'https://play-lh.googleusercontent.com/DhUU3dwLN6m16DzILuK_alrFUOzzzMaOB2TzXs9PAZ7cLEv388vdRB1QV4JKnwRjlDg',
  }, {
    title: 'APPS',
    pathPrefix: '/apps/',
    subItems: [
      { path: '/apps/portfolio', title: 'PORTFOLIO', },
      { path: '/apps/salary', title: 'SALARY' },
      { path: '/apps/lottery', title: 'LOTTERY' },
      { path: '/apps/seo', title: 'SEO' },
      { path: '/apps/games', title: 'GAMES' },
      { path: '/apps/image-resizer', title: 'IMAGE_RESIZER' },
      { path: '/apps/image-moderation', title: 'IMAGE_MODERATION' },
      { path: '/apps/voice-recorder', title: 'VOICE_RECORDER' },
    ],
    img: 'https://aroundsketch.github.io/Apple-App-Icons/App%20Icon/Apple/AppStore/@PNG.png',
  }, {
    title: 'ABOUT',
    path: '/about',
    emoji: '😊',
  }])

  return {
    menuItems,
  }
}

export default useMenuItems