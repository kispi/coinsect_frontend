import { useStore } from 'vuex'

const useBybit = () => {
  const store = useStore()

  const setOrderbook = (json, market) => {
    if (json.type === 'delta') {
      const book = store.getters.orderbooks.bybit[market]
      if (!book) return

      json.data.delete.forEach(o => {
        if (o.side === 'Sell') {
          const targetIdx = book.$$asks.findIndex(ask => ask.price === o.price)
          if (targetIdx < 0) return

          book.$$asks.splice(targetIdx, 1)
        }
        if (o.side === 'Buy') {
          const targetIdx = book.$$bids.findIndex(bid => bid.price === o.price)
          if (targetIdx < 0) return

          book.$$bids.splice(targetIdx, 1)
        }
      })

      json.data.insert.forEach(o => {
        if (o.side === 'Sell') book.$$asks.unshift(o)
        if (o.side === 'Buy') book.$$bids.push(o)
      })

      json.data.update.forEach(o => {
        if (o.side === 'Sell') book.$$asks[book.$$asks.findIndex(ask => ask.price === o.price)] = o
        if (o.side === 'Buy') book.$$bids[book.$$bids.findIndex(bid => bid.price === o.price)] = o
      })
      return
    }
    
    const units = json.data
    const $$asks = []
    const $$bids = []
    let $$biggestSize = 0

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

  const subscribe = ({ type, market }) => {
    if (!type || !market) return

    const connection = new WebSocket('wss://stream.bybit.com/realtime')

    connection.onopen = () => {
      connection.send(JSON.stringify({
        op: 'subscribe',
        args: [`orderBookL2_25.${market}`]
      }))
    }

    connection.onclose = () => {
      setTimeout(() => subscribe({ type, market }), 1000)
    }

    connection.onmessage = event => {
      try {
        const json = JSON.parse(event.data)
        if (!json.data) return

        if (type === 'orderbook') setOrderbook(json, market)
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