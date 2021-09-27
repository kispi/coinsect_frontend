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
          $$symbol: json.s.split('USDT')[0],
          $$tradePriceTarget: parseFloat(json.c) || 0,
          $$vol24HTarget: parseFloat(json.q) || 0,
        })
      } catch (e) {
        console.error(e)
      }
    }
  })

  return {
    subscribe,
  }
}

export default useBinance