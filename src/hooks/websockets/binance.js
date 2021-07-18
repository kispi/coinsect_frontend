import helpers from '@/helpers'
import { useStore } from 'vuex'

const useBinance = () => {
  const store = useStore()

  const subscribe = () => {
    store.getters.websockets.binance.onopen = () => {
      store.getters.websockets.binance.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: store.getters.markets.upbit.map(o => `${(o.$$symbol || '').toLowerCase()}usdt@miniTicker`),
        id: 1,
      }))
    }

    store.getters.websockets.binance.onmessage = event => {
      try {
        const json = JSON.parse(event.data)
        if (!json.s) return

        helpers.dataSetter.calculateKimp({
          $$symbol: json.s.split('USDT')[0],
          $$tradePriceTarget: store.getters.usdKrw * (json.c || 0),
        })
      } catch (e) {
        console.error(e)
      }
    }
  }

  return {
    subscribe,
  }
}

export default useBinance