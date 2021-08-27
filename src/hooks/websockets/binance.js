import helpers from '@/helpers'
import { useStore } from 'vuex'

const useBinance = () => {
  const store = useStore()

  const subscribe = () => new Promise((resolve) => {
    const connection = new WebSocket('wss://stream.binance.com:9443/ws')

    connection.onopen = () => {
      connection.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: store.getters.markets.upbit.map(o => `${(o.$$symbol || '').toLowerCase()}usdt@miniTicker`),
        id: 1,
      }))

      resolve(connection)
    }

    connection.onmessage = event => {
      try {
        const json = JSON.parse(event.data)
        if (!json.s) return

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