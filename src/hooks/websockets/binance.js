import helpers from '@/helpers'
import useWebsocketCommon from './websocket-common'
import useGlobalHooks from '../global-hooks'

const useBinance = () => {
  const { store } = useGlobalHooks()

  const { setTickerSummaryInTitle } = useWebsocketCommon()

  const subscribe = ({ codes, $$raw }) => new Promise((resolve) => {
    const connection = new WebSocket('wss://stream.binance.com:9443/ws')

    connection.onopen = () => {
      connection.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: codes,
        id: 1,
      }))

      resolve(connection)
    }

    connection.onmessage = event => {
      try {
        const json = JSON.parse(event.data)
        if (!json.s) return

        if ($$raw) {
          store.commit('setRawWebsocketInfo', { exchange: 'binance', market: json.s, json })
          return
        }

        const $$symbol = json.s.split((store.getters.settings.baseExchangeMarket === 'krw' ? 'usdt' : 'btc').toUpperCase())[0]
        const $$tickDirectionTarget = (() => {
          if (parseFloat(json.c) > (store.getters.realTimeTickers[$$symbol].$$tradePriceTarget / store.getters.usdKrw)) return 'up'
          if (parseFloat(json.c) < (store.getters.realTimeTickers[$$symbol].$$tradePriceTarget / store.getters.usdKrw)) return 'down'
          return 'same'
        })()

        helpers.dataSetter.calculateKimp({
          // krw마켓은 usdt와 비교, btc는 그대로.
          $$symbol,
          $$tradePriceTarget: parseFloat(json.c) || 0,
          $$vol24HTarget: parseFloat(json.q) || 0,
          $$tickDirectionTarget,
        })

        if (store.getters.settings.documentTitleTicker === $$symbol) setTickerSummaryInTitle(store.getters.realTimeTickers[$$symbol])
      } catch (e) {}
    }
  })

  return {
    subscribe,
  }
}

export default useBinance