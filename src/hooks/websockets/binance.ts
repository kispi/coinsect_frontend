import helpers from '@/helpers'
import useWebsocketCommon from './websocket-common'
import useGlobalHooks from '../global-hooks'

const useBinance = () => {
  const { store } = useGlobalHooks()

  const { setTickerSummaryInTitle } = useWebsocketCommon()

  const subscribe = ({ codes, $$raw }: { codes: string[], $$raw?: boolean }) => new Promise<WebSocket>((resolve) => {
    const connection = new WebSocket('wss://stream.binance.com:9443/ws')

    connection.onopen = () => {
      connection.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: codes.slice(0, 350), // 바이낸스에서 동시 처리 가능한 티커 수를 제한중인 듯... 빗썸은 지금 상장된 코인이 415개인데 계속 연결이 끊기네
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

        helpers.dataSetter.calculateKimp({
          // krw마켓은 usdt와 비교, btc는 그대로.
          $$symbol,
          $$tradePriceTarget: parseFloat(json.c) || 0,
          $$vol24HTarget: parseFloat(json.q) || 0,
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