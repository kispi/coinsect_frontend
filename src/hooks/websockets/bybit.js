import useGlobalHooks from '../global-hooks'

const useBybit = () => {
  const { store } = useGlobalHooks()

  let $$biggestSize = 0

  const setOrderbook = (json, market) => {
    if (json.type === 'delta') {
      if ((json.topic || '').split('.')[1] !== market) return

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

    if (((json.data.order_book || [])[0] || {}).symbol !== market) return

    /*
      USDT Perpetual: json.data.order_book
      Inverse Perpetual: json.data
    */
    const units = market.endsWith('USDT') ? json.data.order_book : json.data
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
      if (json.data.symbol !== market) return

      store.commit('setInstrument', {
        exchange: 'bybit',
        market,
        instrument: json.data,
      })
    } else {
      const o = json.data.update[0]
      if (o.symbol !== market) return

      const exst = store.getters.instruments.bybit[market]
      Object.keys(o).forEach(key => {
        if (exst) exst[key] = o[key]
      })
    }
  }

  const subscribe = ({ type, markets }) => new Promise((resolve) => {
    if (!markets || !type) return

    /*
      USDT Perpetual: /realtime_public
      Inverse Perpetual: /realtime
    */
    const connection = new WebSocket('wss://stream.bybit.com/realtime_public')

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

        if (type.includes('orderBookL2')) markets.forEach(market => setOrderbook(json, market))
        if (type === 'instrument_info.100ms') markets.forEach(market => setInstrument(json, market))
      } catch (e) {}
    }

    return connection
  })

  return {
    subscribe,
  }
}

export default useBybit