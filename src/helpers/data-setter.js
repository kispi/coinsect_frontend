import { store as $store } from '@/store'

export default {
  setPriceRow: ({
    $$symbol,
    $$tradePriceBase,
    $$highest52WeekPrice,
    $$lowest52WeekPrice,
    $$changePrice24H,
    $$changeRate1D,
    $$changeRate52WH,
    $$changeRate52WL,
    $$vol24HBase,
    $$code,
    $$prevClosingPrice,
  }) => {
    if (!$$symbol) return

    const o = $store.getters.realTimeTickers[$$symbol] || {}
    o.$$symbol = $$symbol
    o.$$tradePriceBase = parseFloat($$tradePriceBase)
    o.$$highest52WeekPrice = parseFloat($$highest52WeekPrice)
    o.$$lowest52WeekPrice = parseFloat($$lowest52WeekPrice)
    o.$$changePrice24H = parseFloat($$changePrice24H)
    o.$$changeRate1D = parseFloat($$changeRate1D)
    o.$$changeRate52WH = parseFloat($$changeRate52WH)
    o.$$changeRate52WL = parseFloat($$changeRate52WL)

    // $$vol24HBase는 없는 경우도 있음 (빗썸은 tickType === '24H'인 경우만 사용하기 때문)
    if ($$vol24HBase) o.$$vol24HBase = parseFloat($$vol24HBase)
    o.$$code = $$code
    o.$$prevClosingPrice = parseFloat($$prevClosingPrice)
    $store.getters.realTimeTickers[$$symbol] = o
  },
  calculateKimp: ({
    $$symbol,
    $$tradePriceTarget,
    $$vol24HTarget,
  }) => {
    const o = $store.getters.realTimeTickers[$$symbol] || {}
    if (!o.$$tradePriceBase || !($$tradePriceTarget * $store.getters.usdKrw)) return

    // 여기서는 전부 원화 기준으로.
    o.$$tradePriceTarget = $$tradePriceTarget * $store.getters.usdKrw
    o.$$premiumPrice = o.$$tradePriceBase - o.$$tradePriceTarget
    o.$$premiumRate = Math.round(o.$$premiumPrice / o.$$tradePriceTarget * 10000) / 100
    o.$$vol24HTarget = $$vol24HTarget
    $store.getters.realTimeTickers[$$symbol] = o
  },
}