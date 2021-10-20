import $store from '@/store'

const coin = {
  pickCoins: ({ numCoinsToGenerate, upbitOnly }) => Object.entries($store.getters.symbols)
    .filter(([_, value]) => upbitOnly ? value.kr : true)
    .slice(0, numCoinsToGenerate),
}

export default coin