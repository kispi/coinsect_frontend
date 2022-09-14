import { getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import useWebsocketCommon from './websocket-common'

const useBithumb = () => {
  const store = useStore()

  const plugins = getCurrentInstance().appContext.config.globalProperties

  const { tickDirection } = useWebsocketCommon()

  const setAsBasePriceFromWebSocket = ({ symbol, json }) => {
    const $$tickDirection = tickDirection(symbol, json.closePrice)
    plugins.$helpers.dataSetter.setPriceRow({
      $$symbol: symbol,
      $$tradePriceBase: json.closePrice,
      $$changePrice24H: json.chgAmt,
      $$changeRate1D: (json.chgRate * 100) / 100,
      $$vol24HBase: json.tickType === '24H' ? json.value : 0,
      $$code: json.symbol,
      $$prevClosingPrice: json.prevClosePrice,
      $$tickDirection,
    })
  }

  // 엥간하면 웹소켓이랑 맞추지 빗썸놈들 ㅡㅡ
  const setAsBasePriceFromRestAPI = ({ symbol, json }) => {
    plugins.$helpers.dataSetter.setPriceRow({
      $$symbol: symbol,
      $$tradePriceBase: json.closing_price,
      $$vol24HBase: json.acc_trade_value_24H,
      $$code: symbol,
      $$prevClosingPrice: json.prev_closing_price,
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
      exchange: 'bithumb',
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

  const subscribe = ({ type, symbols, $$raw }) => new Promise((resolve) => {
    if (!type || !symbols) return

    const connection = new WebSocket('wss://pubwss.bithumb.com/pub/ws')

    connection.onopen = () => {
      connection.send(JSON.stringify({
        type: 'ticker',
        symbols,
        tickTypes: ['24H', 'MID'],
      }))

      resolve(connection)
    }

    const handleTickerMessage = json => {
      if (!json) return

      const symbol = json.symbol.split('_KRW')[0]
      setAsBasePriceFromWebSocket({ symbol, json })
    }

    connection.onmessage = event => {      
      try {
        const data = JSON.parse(event.data)
        const json = data.content
        if (type === 'ticker') {
          if ($$raw) {
            store.commit('setRawWebsocketInfo', { exchange: 'bithumb', market: json.symbol, json })
            return
          }

          handleTickerMessage(json)
        }
        if (type === 'orderbook') setOrderbook(json)
      } catch (e) {}
    }
  })

  return {
    setAsBasePriceFromRestAPI,
    subscribe,
  }
}

export default useBithumb