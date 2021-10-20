import $store from '@/store'

const coin = {
  pickCoins: ({ numCoinsToGenerate, withinTheseSymbols, upbitOnly }) => {
    const o = {}
    const pool = withinTheseSymbols || Object.keys($store.getters.symbols).filter(o => upbitOnly ? o.kr : true)

    if (!pool) return

    for (let i = 0; i < 1000; i++) {
      const randomCoin = pool[Math.floor(Math.random() * pool.length)]
      o[randomCoin] = true
      if (Object.keys(o).length >= numCoinsToGenerate) break
    }

    return Object.keys(o)
  },
}

export default coin