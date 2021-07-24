import $store from '@/store'

export default {
  setPriceRow: ({
    $$symbol,
    $$name,
    $$tradePriceBase,
    $$highest52WeekPrice,
    $$lowest52WeekPrice,
    $$changePrice24H,
    $$changeRate1D,
    $$changeRate52WH,
    $$changeRate52WL,
    $$vol24HBase,
  }) => {
    if (!$$symbol) return

    const o = $store.getters.realTimeTickers[$$symbol] || {}
    o.$$symbol = $$symbol
    if ($$name) o.$$name = $$name
    if ($$tradePriceBase) o.$$tradePriceBase = $$tradePriceBase
    if ($$highest52WeekPrice) o.$$highest52WeekPrice = $$highest52WeekPrice
    if ($$lowest52WeekPrice) o.$$lowest52WeekPrice = $$lowest52WeekPrice
    if ($$changePrice24H) o.$$changePrice24H = $$changePrice24H
    if ($$changeRate1D) o.$$changeRate1D = $$changeRate1D
    if ($$changeRate52WH) o.$$changeRate52WH = $$changeRate52WH
    if ($$changeRate52WL) o.$$changeRate52WL = $$changeRate52WL
    if ($$vol24HBase) o.$$vol24HBase = $$vol24HBase
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