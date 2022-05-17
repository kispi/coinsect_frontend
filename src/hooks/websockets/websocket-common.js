import { getCurrentInstance } from 'vue'
import { useStore } from 'vuex'

const useWebsocketCommon = () => {
  const plugins = getCurrentInstance().appContext.config.globalProperties

  const store = useStore()

  const setTickerSummaryInTitle = ticker => {
    const priceString = plugins.$helpers.number.pretty.price({ price: ticker.$$tradePriceBase, baseCurrency: store.getters.settings.baseExchangeMarket })
    const suffix = store.getters.settings.baseExchangeMarket === 'btc' ? 'BTC' : store.getters.settings.currency.toUpperCase()
    document.title = `${!isNaN(ticker.$$premiumRate) ? `${plugins.$helpers.number.pretty.percent(ticker.$$premiumRate)}%, ` : 'Waiting... '}${priceString} ${ticker.$$symbol}/${suffix}`
  }

  return {
    setTickerSummaryInTitle,
  }
}

export default useWebsocketCommon