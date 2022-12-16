import useGlobalHooks from '../global-hooks'

const useWebsocketCommon = () => {
  const { plugins, store } = useGlobalHooks()

  const setTickerSummaryInTitle = ticker => {
    const priceString = plugins.$helpers.number.pretty.price({ price: ticker.$$tradePriceBase, baseCurrency: store.getters.settings.baseExchangeMarket })
    const suffix = store.getters.settings.baseExchangeMarket === 'btc' ? 'BTC' : store.getters.settings.currency.toUpperCase()
    document.title = `${!isNaN(ticker.$$premiumRate) ? `${plugins.$helpers.number.pretty.percent(ticker.$$premiumRate)}%, ` : 'Waiting... '}${priceString} ${ticker.$$symbol}/${suffix}`
  }

  const tickDirection = (symbol, newPrice) => {
    const p = (store.getters.realTimeTickers[symbol] || {}).$$tradePriceBase
    if (p < newPrice) return 'up'
    if (p > newPrice) return 'down'
    return 'same'
  }

  return {
    setTickerSummaryInTitle,
    tickDirection,
  }
}

export default useWebsocketCommon