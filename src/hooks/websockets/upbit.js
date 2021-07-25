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
      $$changeRate1D: Math.round(json.signed_change_rate * 10000) / 100,
      $$changeRate52WH: Math.round((json.trade_price - json.highest_52_week_price) / json.highest_52_week_price * 10000) / 100,
      $$changeRate52WL: Math.round((json.trade_price - json.lowest_52_week_price) / json.lowest_52_week_price * 10000) / 100,
      $$vol24HBase: json.acc_trade_price_24h,
    })
  }

  const setDocumentTitle = ticker => {
    const priceString = helpers.number.pretty.price({ price: ticker.$$tradePriceBase, baseCurrency: 'krw' })
    document.title = `${ticker.$$premiumRate ? `${ticker.$$premiumRate.toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })}% / ` : ''}${priceString} ${ticker.$$symbol}`
  }

  const subscribe = ({ type, codes }) => {
    const connection = new WebSocket('wss://api.upbit.com/websocket/v1')
    connection.binaryType = 'arraybuffer'

    connection.onopen = () => {
      connection.send(JSON.stringify([{
        ticket: 'coinsect-upbit',
      }, {
        type,
        codes,
      }]))
    }

    connection.onclose = () => {
      setTimeout(() => subscribe(type, codes), 1000)
    }

    const handleTickerMessage = json => {
      const symbol = json.code.split('KRW-')[1]
      setAsBasePrice({ symbol, json })
      if (store.getters.settings.documentTitleTicker === symbol) setDocumentTitle(store.getters.realTimeTickers[symbol])
    }

    const handleOrderbookMessage = json => {
      console.log(json)
    }

    connection.onmessage = event => {
      try {
        const json = JSON.parse(dec.decode(new Uint8Array(event.data)))
        if (type === 'ticker') handleTickerMessage(json)
        if (type === 'orderbook') handleOrderbookMessage(json)
      } catch (e) {}
    }
  }

  return {
    subscribe,
    setDocumentTitle,
  }
}

export default useUpbit