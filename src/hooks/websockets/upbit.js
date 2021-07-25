import helpers from '@/helpers'
import { useStore } from 'vuex'

const useUpbit = () => {
  const store = useStore()

  const dec = new TextDecoder('utf-8')

  const eventAsJSON = event => JSON.parse(dec.decode(new Uint8Array(event.data)))

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
      $$code: json.code,
      $$prevClosingPrice: json.prev_closing_price,
    })
  }

  const setOrderbooks = json => {
    store.commit('setOrderbooks', {
      exchange: 'upbit',
      market: json.code,
      orderbooks: {
        $$code: json.code,
        $$asks: json.orderbook_units.sort((a, b) => b.ask_price - a.ask_price).map(o => ({
          price: o.ask_price,
          size: o.ask_size,
        })),
        $$bids: json.orderbook_units.sort((a, b) => b.bid_price - a.bid_price).map(o => ({
          price: o.bid_price,
          size: o.bid_size,
        })),
        $$totalAskSize: json.total_ask_size,
        $$totalBidSize: json.total_bid_size,
      },
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
      if (!type || !codes) return

      setTimeout(() => subscribe(type, codes), 1000)
    }

    const handleTickerMessage = json => {
      const symbol = json.code.split('KRW-')[1]
      setAsBasePrice({ symbol, json })
      if (store.getters.settings.documentTitleTicker === symbol) setDocumentTitle(store.getters.realTimeTickers[symbol])
    }

    connection.onmessage = event => {
      try {
        const json = eventAsJSON(event)
        if (type === 'ticker') handleTickerMessage(json)
        if (type === 'orderbook') setOrderbooks(json)
      } catch (e) {
        console.error(e)
      }
    }

    return connection
  }

  return {
    eventAsJSON,
    subscribe,
    setDocumentTitle,
  }
}

export default useUpbit