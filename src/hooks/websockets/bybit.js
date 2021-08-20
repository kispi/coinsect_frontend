import { useStore } from 'vuex'

const useBybit = () => {
  const store = useStore()

  let $$biggestSize = 0

  const setOrderbook = (json, market) => {
    if (json.type === 'delta') {
      const book = store.getters.orderbooks.bybit[market]
      if (!book) return

      json.data.delete.forEach(o => {
        if (o.side === 'Sell') {
          const targetIdx = book.$$asks.findIndex(ask => ask.price === o.price)
          if (targetIdx < 0) return

          book.$$asks.splice(targetIdx, 1)
          return
        }

        if (o.side === 'Buy') {
          const targetIdx = book.$$bids.findIndex(bid => bid.price === o.price)
          if (targetIdx < 0) return

          book.$$bids.splice(targetIdx, 1)
          return
        }
      })

      json.data.insert.forEach(o => {
        if (o.side === 'Sell') {
          book.$$asks.push(o)
          book.$$asks.sort((a, b) => b.price - a.price)
          return
        }

        if (o.side === 'Buy') {
          book.$$bids.push(o)
          book.$$bids.sort((a, b) => b.price - a.price)
          return
        }
      })

      json.data.update.forEach(o => {
        if (o.side === 'Sell') book.$$asks[book.$$asks.findIndex(ask => ask.price === o.price)] = o
        if (o.side === 'Buy') book.$$bids[book.$$bids.findIndex(bid => bid.price === o.price)] = o
      })

      book.$$biggestSize = Math.max(...[...book.$$asks, ...book.$$bids].map(o => o.size))
      return
    }
    
    const units = json.data
    const $$asks = []
    const $$bids = []

    units.forEach(unit => {
      if (unit.side === 'Sell') {
        $$asks.unshift({
          price: unit.price,
          size: unit.size,
        })
      }

      if (unit.side === 'Buy') {
        $$bids.unshift({
          price: unit.price,
          size: unit.size,
        })
      }

      if (unit.size >= $$biggestSize) $$biggestSize = unit.size
    })

    store.commit('setOrderbook', {
      exchange: 'bybit',
      market,
      orderbook: {
        $$code: market,
        $$asks,
        $$bids,
        $$biggestSize,
      },
    })
  }

  const setInstrument = (json, market) => {
    if (!json.data.update) {
      store.commit('setInstrument', {
        exchange: 'bybit',
        market,
        instrument: json.data,
      })
    } else {
      const exst = store.getters.instruments.bybit[market]
      const o = json.data.update[0]
      Object.keys(o).forEach(key => exst[key] = o[key])
    }
  }

  const subscribe = ({ type, market }) => {
    if (!market || !type) return

    const connection = new WebSocket('wss://stream.bybit.com/realtime')

    connection.onopen = () => {
      connection.send(JSON.stringify({
        op: 'subscribe',
        args: [`${type}.${market}`]
      }))
    }

    connection.onmessage = event => {
      try {
        const json = JSON.parse(event.data)
        if (!json.data) return

        if (type.includes('orderBookL2')) setOrderbook(json, market)
        if (type === 'instrument_info.100ms') setInstrument(json, market)
      } catch (e) {
        console.error(e)
      }
    }

    return connection
  }

  return {
    subscribe,
  }
}

export default useBybit