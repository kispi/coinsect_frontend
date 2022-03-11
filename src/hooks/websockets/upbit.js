import { getCurrentInstance } from 'vue'
import { useStore } from 'vuex'

const useUpbit = () => {
  const store = useStore()

  const plugins = getCurrentInstance().appContext.config.globalProperties

  const dec = new TextDecoder('utf-8')

  const eventAsJSON = event => JSON.parse(dec.decode(new Uint8Array(event.data)))

  const setAsBasePrice = ({ symbol, json }) => {
    plugins.$helpers.dataSetter.setPriceRow({
      $$symbol: symbol,
      $$tradePriceBase: json.tp,
      $$highest52WeekPrice: json.h52wp,
      $$lowest52WeekPrice: json.l52wp,
      $$changePrice24H: json.scp,
      $$changeRate1D: Math.round(json.scr * 10000) / 100,
      $$changeRate52WH: Math.round((json.tp - json.h52wp) / json.h52wp * 10000) / 100,
      $$changeRate52WL: Math.round((json.tp - json.l52wp) / json.l52wp * 10000) / 100,
      $$vol24HBase: json.atp24h,
      $$code: json.cd,
      $$prevClosingPrice: json.pcp,
    })
  }

  const setOrderbook = json => {
    const $$asks = []
    const $$bids = []
    const units = json.obu
    let $$biggestSize = 0

    units.forEach((unit, idx) => {
      $$asks.push({
        price: units[units.length - idx - 1].ap,
        size: units[units.length - idx - 1].as,
      })

      $$bids.push({
        price: units[idx].bp,
        size: units[idx].bs,
      })

      if (unit.as >= $$biggestSize) $$biggestSize = unit.as
      if (unit.bs >= $$biggestSize) $$biggestSize = unit.bs
    })

    store.commit('setOrderbook', {
      exchange: 'upbit',
      market: json.cd,
      orderbook: {
        $$code: json.cd,
        $$asks,
        $$bids,
        $$totalAskSize: json.tas,
        $$totalBidSize: json.tbs,
        $$biggestSize,
      },
    })
  }

  const setDocumentTitle = ticker => {
    const priceString = plugins.$helpers.number.pretty.price({ price: ticker.$$tradePriceBase, baseCurrency: 'krw' })
    document.title = `${!isNaN(ticker.$$premiumRate) ? `${plugins.$helpers.number.pretty.percent(ticker.$$premiumRate)}% / ` : 'Connecting... '}${priceString} ${ticker.$$symbol}`
  }

  const subscribe = ({ type, codes, $$raw }) => new Promise((resolve) => {
    if (!type || !codes) return

    const connection = new WebSocket('wss://api.upbit.com/websocket/v1')
    connection.binaryType = 'arraybuffer'

    connection.onopen = () => {
      connection.send(JSON.stringify([{
        ticket: 'coinsect-upbit',
      }, {
        type,
        codes,
      }, {
        format: 'SIMPLE',
      }]))

      resolve(connection)
    }

    const handleTickerMessage = json => {
      const symbol = json.cd.split('KRW-')[1]
      setAsBasePrice({ symbol, json })
      if (store.getters.settings.documentTitleTicker === symbol) setDocumentTitle(store.getters.realTimeTickers[symbol])
    }

    connection.onmessage = event => {
      try {
        const json = eventAsJSON(event)
        if (type === 'ticker') {
          if ($$raw) {
            store.commit('setRawWebsocketInfo', { exchange: 'upbit', market: json.cd, json })
            return
          }

          handleTickerMessage(json)
        }
        if (type === 'orderbook') setOrderbook(json)
      } catch (e) {
        console.error(e)
      }
    }
  })

  return {
    eventAsJSON,
    subscribe,
    setAsBasePrice,
    setDocumentTitle,
  }
}

export default useUpbit