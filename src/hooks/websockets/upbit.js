import helpers from '@/helpers'
import { useStore } from 'vuex'

const useUpbit = () => {
  const store = useStore()

  const dec = new TextDecoder('utf-8')

  const setAsBasePrice = ({ symbol, json }) => {
    helpers.dataSetter.setPriceRow({
      $$symbol: symbol,
      $$name: store.getters.symbols[symbol],
      $$tradePriceBase: json.trade_price,
      $$highest52WeekPrice: json.highest_52_week_price,
      $$lowest52WeekPrice: json.lowest_52_week_price,
      $$changePrice24H: json.signed_change_price,
      $$changeRate24H: Math.round(json.signed_change_rate * 10000) / 100,
      $$changeRate52WH: Math.round((json.trade_price - json.highest_52_week_price) / json.highest_52_week_price * 10000) / 100,
      $$changeRate52WL: Math.round((json.trade_price - json.lowest_52_week_price) / json.lowest_52_week_price * 10000) / 100,
      $$vol24H: json.acc_trade_price_24h,
    })
  }

  const setDocumentTitle = ticker => {
    if (store.getters.settings.documentTitleTicker !== ticker.$$symbol) return

    const priceString = helpers.template.prettyPrice({ price: ticker.$$tradePriceBase, numFrac: ticker.$$tradePriceBase >= 100 ? 0 : 2 })
    document.title = `${ticker.$$premiumRate ? `${helpers.template.prettyPrice({ price: ticker.$$premiumRate, numFrac: 2 })}% / ` : ''}${priceString} ${ticker.$$symbol}`
  }

  const subscribe = () => {
    store.getters.websockets.upbit.onopen = () => {
      store.getters.websockets.upbit.send(JSON.stringify([{
        ticket: 'coinsect-upbit',
      }, {
        type: 'ticker',
        codes: store.getters.markets.upbit.map(o => o.market),
      }]))
    }

    store.getters.websockets.upbit.onmessage = event => {
      try {
        const json = JSON.parse(dec.decode(new Uint8Array(event.data)))
        const symbol = json.code.split('KRW-')[1]
        setAsBasePrice({ symbol, json })
        setDocumentTitle(store.getters.realTimeTickers[symbol])
      } catch (e) {
        console.error(e)
      }
    }
  }

  return {
    subscribe,
    setDocumentTitle,
  }
}

export default useUpbit