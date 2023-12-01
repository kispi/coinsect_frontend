import useGlobalHooks from '../global-hooks'

const useBybit = () => {
  const { store } = useGlobalHooks()

  let $$biggestSize = 0

  let orderbookSize = 0

  const setOrderbook = (json, market) => {
    if (json.type === 'delta') {
      const splitted = (json.topic || '').split('.')
      if (splitted[splitted.length - 1] !== market) return

      const book = store.getters.orderbooks.bybit[market]
      if (!book) return

      json.data.a.forEach(ask => {
        const idx = book.$$asks.findIndex(o => o.price === ask[0])
        const newAsk = { price: ask[0], size: ask[1] }
        if (idx >= 0) {
          if (parseFloat(newAsk.size) === 0) book.$$asks.splice(idx, 1)
          else book.$$asks[idx] = newAsk
        } else {
          book.$$asks.push(newAsk)
          book.$$asks.sort((a, b) => b.price - a.price)
        }
      })

      json.data.b.forEach(bid => {
        const idx = book.$$bids.findIndex(o => o.price === bid[0])
        const newBid = { price: bid[0], size: bid[1] }
        if (idx >= 0) {
          if (parseFloat(newBid.size) === 0) book.$$bids.splice(idx, 1)
          else book.$$bids[idx] = newBid
        } else {
          book.$$bids.push(newBid)
          book.$$bids.sort((a, b) => b.price - a.price)
        }
      })

      book.$$biggestSize = Math.max(...[...book.$$asks, ...book.$$bids].map(o => o.size))
      return
    }

    if (json.data.s !== market) return

    // snapshot
    orderbookSize = json.data.a.length
    const $$asks = json.data.a.map(ask => ({
      price: ask[0],
      size: ask[1],
    })).reverse()

    const $$bids = json.data.b.map(bid => ({
      price: bid[0],
      size: bid[1],
    }))

    $$asks.concat($$bids).forEach(o => {
      if (o.size >= $$biggestSize) $$biggestSize = o.size
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
    if (json.type === 'snapshot') {
      if (json.data.symbol !== market) return

      store.commit('setInstrument', {
        exchange: 'bybit',
        market,
        instrument: json.data,
      })
    } else {
      const o = json.data
      if (o.symbol !== market) return

      const exst = store.getters.instruments.bybit[market]
      Object.keys(o).forEach(key => {
        if (exst) exst[key] = o[key]
      })
    }
  }

  const subscribe = ({ type, markets }) => new Promise((resolve) => {
    if (!markets || !type) return

    const connection = new WebSocket('wss://stream.bybit.com/v5/public/linear')

    connection.onopen = () => {
      connection.send(JSON.stringify({
        op: 'subscribe',
        args: markets.map(market => `${type}.${market}`),
      }))

      resolve(connection)
    }

    connection.onmessage = event => {
      try {
        const json = JSON.parse(event.data)
        if (!json.data) return

        if (type.includes('orderbook')) markets.forEach(market => setOrderbook(json, market))
        if (type === 'tickers') markets.forEach(market => setInstrument(json, market))
      } catch (e) {}
    }

    return connection
  })

  return {
    subscribe,
  }
}

export default useBybit