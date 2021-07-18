import { computed } from 'vue'
import { useStore } from 'vuex'

const useWebsocket = () => {
  const store = useStore()

  const dec = new TextDecoder('utf-8')

  const websockets = computed(() => store.getters.websockets)

  const subscribe = {
    upbit: () => {
      websockets.value.upbit.onopen = () => {
        websockets.value.upbit.send(JSON.stringify([{
          ticket: 'coinsect-test',
        }, {
          type: 'ticker',
          codes: store.getters.markets.upbit.map(o => o.market),
        }]))
      }
  
      websockets.value.upbit.onmessage = event => {
        try {
          const json = JSON.parse(dec.decode(new Uint8Array(event.data)))          
          if (!json.code.startsWith('KRW-')) return
  
          const idx = (store.getters.realTimeTickers.upbit || []).findIndex(o => o.code === json.code)
          json.$$symbol = json.code.split('KRW-')[1]
          json.$$name = store.getters.symbols[json.$$symbol]
          json.$$changeRate24H = Math.round(json.signed_change_rate * 10000) / 100
          json.$$changeRate52WH = Math.round((json.trade_price - json.highest_52_week_price) / json.highest_52_week_price * 10000) / 100
          json.$$changeRate52WL = Math.round((json.trade_price - json.lowest_52_week_price) / json.lowest_52_week_price * 10000) / 100
          if (idx >= 0) store.getters.realTimeTickers.upbit[idx] = json
          else store.getters.realTimeTickers.upbit = (store.getters.realTimeTickers.upbit || []).concat([json])
        } catch (e) {
          console.error(e)
        }
      }
  
      websockets.value.upbit.onerror = event => console.error(event)
    },
    bithumb: () => {
      
    }
  }

  return {
    subscribe,
  }
}

export default useWebsocket