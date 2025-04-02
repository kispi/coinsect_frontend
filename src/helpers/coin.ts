import { store } from '@/store'

const coin = {
  pickCoins: ({ numCoinsToGenerate, upbitOnly }: { numCoinsToGenerate: number, upbitOnly?: boolean }) => Object.entries(store.getters.symbols as Record<string, { kr: boolean }>)
    .filter(([, value]) => (upbitOnly ? value.kr : true))
    .slice(0, numCoinsToGenerate),
}

export default coin