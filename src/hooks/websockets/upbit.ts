import useGlobalHooks from '../global-hooks'
import useWebsocketCommon from './websocket-common'

const useUpbit = () => {
  const { helpers, store } = useGlobalHooks()

  const { tickDirection } = useWebsocketCommon()

  const eventAsJSON = (event: any) => {
    if (typeof event.data === 'string') {
      return JSON.parse(event.data)
    }
    // Fallback for arraybuffer if needed, but Go server will send text JSON
    const dec = new TextDecoder('utf-8')
    return JSON.parse(dec.decode(new Uint8Array(event.data)))
  }

  const setAsBasePrice = ({ symbol, json }: { symbol: string, json: any }) => {
    const $$tickDirection = tickDirection(symbol, json.tp)
    helpers.dataSetter.setPriceRow({
      $$symbol: symbol,
      $$tradePriceBase: json.tp,
      $$highest52WeekPrice: json.h52wp,
      $$lowest52WeekPrice: json.l52wp,
      $$changePrice24H: json.scp,
      $$changeRate1D: (Math.round(json.scr * 10000) / 100).toString(),
      $$changeRate52WH: (Math.round((json.tp - json.h52wp) / json.h52wp * 10000) / 100).toString(),
      $$changeRate52WL: (Math.round((json.tp - json.l52wp) / json.l52wp * 10000) / 100).toString(),
      $$vol24HBase: json.atp24h,
      $$code: json.cd,
      $$caution: json.mw,
      $$prevClosingPrice: json.pcp,
      $$tickDirection,
    })
  }

  const setOrderbook = (json: any) => {
    const $$asks = [] as any[]
    const $$bids = [] as any[]
    const units = json.obu
    let $$biggestSize = 0

    units.forEach((unit: any, idx: number) => {
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

  const subscribe = ({ type, codes, $$raw }: { type: string, codes: string[], $$raw: boolean }) => new Promise<WebSocket>((resolve) => {
    if (!type || !codes) return

    const endpoint = process.env.NODE_ENV === 'production' ? 'wss://api.coinsect.io/upbit' : 'ws://localhost:8080/ws'
    const connection = new WebSocket(endpoint)

    connection.onopen = () => {
      connection.send(JSON.stringify([{
        ticket: helpers.logic.generateUUIDV4(),
      }, {
        type,
        codes: codes.map(code => `${code}`),
      }, {
        format: 'SIMPLE',
      }]))

      resolve(connection)
    }

    const handleTickerMessage = (json: any) => {
      const symbol = json.cd.split(`${store.getters.settings.baseExchangeMarket.toUpperCase()}-`)[1]
      setAsBasePrice({ symbol, json })
    }

    connection.onmessage = event => {
      try {
        const jsonOrArray = eventAsJSON(event)
        const items = Array.isArray(jsonOrArray) ? jsonOrArray : [jsonOrArray]

        items.forEach((json) => {
          if (type === 'ticker') {
            if ($$raw) {
              store.commit('setRawWebsocketInfo', { exchange: 'upbit', market: json.cd, json })
              return
            }

            handleTickerMessage(json)
          }
          if (type === 'orderbook') setOrderbook(json)
        })
      } catch (e) {}
    }
  })

  return {
    eventAsJSON,
    subscribe,
    setAsBasePrice,
  }
}

export default useUpbit