import helpers from '@/helpers'

const items = [{
  link: 'https://alternative.me/crypto/fear-and-greed-index/',
  title: 'Crypto Fear & Greed Index',
  description: `
    <a
      href="https://alternative.me/crypto/fear-and-greed-index/"
      target="_blank"
      rel="noreferrer"
      style="display: table; margin-bottom: 16px;">
      <img
        src="https://alternative.me/crypto/fear-and-greed-index.png"
        alt="Latest Crypto Fear & Greed Index"
        style="width: 320px;"
      >
      <figcaption>금일(${helpers.dayjs().format('YYYY-MM-DD')}) Fear & Greed 지수</figcaption>
    </a>변동성, 소셜 미디어 분위기, 마켓 모멘텀, 비트코인 점유율, 트렌드 등의 여러 요소들을 종합하여 현재 시장의 Sentiment가 어떤지 나타내주는 지표이다.

    높을수록 현재 시장이 탐욕스럽고, 낮을수록 대부분이 공포를 느끼고 있다고 볼 수 있고, 보통 이 지표가 한쪽으로 과하게 쏠렸을 때
    역추세 포지션을 취하면 큰 이득을 보는 경우가 많다. <s>(근데 코로나빔 부처빔같은 지나친 변동성의 이벤트들이 나오면 약간만 포지션이 안좋아도 사망)</s>
  `,
}, {
  link: 'https://stats.buybitcoinworldwide.com/stock-to-flow/',
  title: 'Stock to Flow (S2F) Model',
  description: `
    아마 비트코인의 가격추이를 예측하려고 만들어진 모델들 중 가장 유명한 모델일 S2F 모델은, 특정 자원군의 희소성을 측정하는 척도이다.
    해당 자원이 새로 생성되는 양과, 이미 존재하는 양의 비로 계산되며, 이 비가 <span class="c-danger-light">높을수록</span> 희소하다고 볼 수 있다.

    간단히 계산해보자.

    이미 채굴된 비트코인: 18,800,000개
    블록당 보상: 반감기 3회를 거쳤으므로 50 / 2 / 2 / 2 = 6.25 비트코인
    연간 채굴되는 비트코인: 대략 10분에 한 블록이 생성되므로 24 * 6 * 6.25 * 365 = 약 328500개
    연간 S2F 값: 18,800,000 / 900 =  57.23

    즉, 현재 속도로 비트코인을 채굴한다면 현재 유통량만큼을 다시 만들어내는데 57년이 걸린다는 뜻이다.

    반감기가 한 번 더 오는 2024년경에는 저 수치가 무려 114년으로 증가한다.

    금, 은 등의 귀금속들조차 운좋게 광산을 찾으면 공급이 늘어날 수 있지만, 코드로 공급량을 제한하고
    전세계 수많은 컴퓨터들이 엄청난 해시파워로 그 코드를 돌리고 있는 비트코인은 시간에 따라 희소성이 점점 높아짐이 보장되어 있다.

    비트코인에 위 모델을 적용한 유명 분석가 PlanB는 이를 통해 비트코인의 가격을 예측하는 모델을 만들었는데,
    2021년 11월 현재 그가 6월에 한창 장 분위기 최악일 때 트윗한 <a
      class="text-underline"
      href="https://twitter.com/100trillionUSD/status/1406577006230245376"
      rel="noreferrer"
      target="_blank">최악의 시나리오</a>가 대충 맞고 있어서 수많은 사람들을 소름돋게 만드는 중이다.

    안타깝게도 11월부터의 예측은 틀려버려서 모델이 드디어 깨졌다는 이야기가 나오는데,
    PlanB의 모델은 특정 기간의 '평균 가격'을 예측하는데 의의가 있기에, 향후 결국 10만 달러를 뚫고 그 위에서 상당시간을 보내게 될 것인가가 다음 관심으로 떠오른다.
  `,
}, {
  link: 'https://stats.buybitcoinworldwide.com/never-look-back-price/',
  title: 'Never Look Back (NLB) Price',
  description: `
    '이 시점 이후로 이 아래로는 다시는 안 내려갔던 가격'을 점도화하여 그래프로 만든 지표.

    상승장에서는 이 그래프의 우측 가격대가 현재 시장가와 대개 큰 차이가 없으며 (당연하지 price discovery중인데)
    하락장에는 급격하게 눌리는 것을 볼 수 있고, 정의 자체부터가 시간이 지남에 따라 반드시 증가할 수 밖에 없는 지표이다.

    최근 2년간 대단히 빠른 속도로 '바닥'이 올라온 것을 볼 수 있다. (Thanks to FED)
  `,
}]

export default items