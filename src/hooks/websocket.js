import { computed } from 'vue'
import { useStore } from 'vuex'

const useWebsocket = () => {
  const store = useStore()

  const dec = new TextDecoder('utf-8')

  const websockets = computed(() => store.getters.websockets)

  const subscribe = exchange => {
    websockets.value[exchange].onopen = () => {
      websockets.value[exchange].send(JSON.stringify([{
        ticket: 'coinsect-test',
      }, {
        type: 'ticker',
        codes: store.getters.markets[exchange].map(o => o.market),
      }]))
    }

    websockets.value[exchange].onmessage = event => {
      try {
        const json = JSON.parse(dec.decode(new Uint8Array(event.data)))          
        if (!json.code.startsWith('KRW-')) return

        const idx = (store.getters.realTimeTickers[exchange] || []).findIndex(o => o.code === json.code)
        json.$$symbol = json.code.split('KRW-')[1]
        json.$$name = store.getters.symbols[json.$$symbol]
        if (idx >= 0) store.getters.realTimeTickers[exchange][idx] = json
        else store.getters.realTimeTickers[exchange] = (store.getters.realTimeTickers[exchange] || []).concat([json])
      } catch (e) {
        console.error(e)
      }
    }

    websockets.value[exchange].onerror = event => console.error(event)
  }

  return {
    subscribe,
  }
}

export default useWebsocket