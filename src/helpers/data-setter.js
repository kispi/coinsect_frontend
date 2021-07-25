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
    $$code,
    $$prevClosingPrice,
  }) => {
    if (!$$symbol) return

    const o = $store.getters.realTimeTickers[$$symbol] || {}
    o.$$symbol = $$symbol
    o.$$name = $$name
    o.$$tradePriceBase = $$tradePriceBase
    o.$$highest52WeekPrice = $$highest52WeekPrice
    o.$$lowest52WeekPrice = $$lowest52WeekPrice
    o.$$changePrice24H = $$changePrice24H
    o.$$changeRate1D = $$changeRate1D
    o.$$changeRate52WH = $$changeRate52WH
    o.$$changeRate52WL = $$changeRate52WL
    o.$$vol24HBase = $$vol24HBase
    o.$$code = $$code
    o.$$prevClosingPrice = $$prevClosingPrice
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