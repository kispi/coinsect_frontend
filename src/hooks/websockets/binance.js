import helpers from '@/helpers'
import { useStore } from 'vuex'

const useBinance = () => {
  const store = useStore()

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

        helpers.dataSetter.calculateKimp({
          // krw마켓은 usdt와 비교, btc는 그대로.
          $$symbol: json.s.split((store.getters.settings.baseExchangeMarket === 'krw' ? 'usdt' : 'btc').toUpperCase())[0],
          $$tradePriceTarget: parseFloat(json.c) || 0,
          $$vol24HTarget: parseFloat(json.q) || 0,
        })
      } catch (e) {}
    }
  })

  return {
    subscribe,
  }
}

export default useBinance