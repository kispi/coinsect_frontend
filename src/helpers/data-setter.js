import $store from '@/store'

export default {
  setPriceRow: ({
    $$symbol,
    $$name,
    $$tradePriceBase,
    $$highest52WeekPrice,
    $$lowest52WeekPrice,
    $$changePrice24H,
    $$changeRate24H,
    $$changeRate52WH,
    $$changeRate52WL,
    $$vol24H,
  }) => {
    if (!$$symbol) return

    const o = $store.getters.realTimeTickers[$$symbol] || {}
    o.$$symbol = $$symbol
    if ($$name) o.$$name = $$name
    if ($$tradePriceBase) o.$$tradePriceBase = $$tradePriceBase
    if ($$highest52WeekPrice) o.$$highest52WeekPrice = $$highest52WeekPrice
    if ($$lowest52WeekPrice) o.$$lowest52WeekPrice = $$lowest52WeekPrice
    if ($$changePrice24H) o.$$changePrice24H = $$changePrice24H
    if ($$changeRate24H) o.$$changeRate24H = $$changeRate24H
    if ($$changeRate52WH) o.$$changeRate52WH = $$changeRate52WH
    if ($$changeRate52WL) o.$$changeRate52WL = $$changeRate52WL
    if ($$vol24H) o.$$vol24H = $$vol24H
    $store.getters.realTimeTickers[$$symbol] = o
  },
  calculateKimp: ({
    $$symbol,
    $$tradePriceTarget,
  }) => {
    const o = $store.getters.realTimeTickers[$$symbol] || {}
    if (!o.$$tradePriceBase || !$$tradePriceTarget) return

    o.$$tradePriceTarget = $$tradePriceTarget
    o.$$premiumPrice = o.$$tradePriceBase - o.$$tradePriceTarget
    o.$$premiumRate = Math.round(o.$$premiumPrice / o.$$tradePriceTarget * 10000) / 100
    $store.getters.realTimeTickers[$$symbol] = o
  },
}