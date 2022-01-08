import $store from '@/store'

const conversionRatio = baseCurrency => {
  if (baseCurrency === $store.getters.settings.currency) return 1

  if (baseCurrency === 'krw' && $store.getters.settings.currency === 'usd') return 1 / $store.getters.usdKrw

  if (baseCurrency === 'usd' && $store.getters.settings.currency === 'krw') return $store.getters.usdKrw
}

export default {
  pretty: {
    price: ({ price, baseCurrency }) => {
      const converted = price * conversionRatio(baseCurrency)

      let numFracs = 0
      if (Math.abs(converted) < 100) numFracs = 2
      if (Math.abs(converted) < 1) numFracs = 4
      if (Math.abs(converted) < 0.0001) numFracs = 8

      if (converted === 0) numFracs = 2

      return converted.toLocaleString(undefined, {
        maximumFractionDigits: numFracs,
        minimumFractionDigits: numFracs,
      })
    },
    cap: ({ cap, baseCurrency, numKorUnits = 2 }) => {
      const converted = cap * conversionRatio(baseCurrency)

      if ($store.getters.translation.locale === 'en') {
        if (converted / Math.pow(10, 12) >= 1) return `${Math.round(converted / Math.pow(10, 12) * 10000) / 10000}T`
        if (converted / Math.pow(10, 9) >= 1) return `${Math.round(converted / Math.pow(10, 9) * 10000) / 10000}B`
      }

      if ($store.getters.translation.locale === 'kr') {
        const units = [
          { key: '조', val: Math.pow(10, 12) },
          { key: '억', val: Math.pow(10, 8) },
          { key: '만', val: Math.pow(10, 4) },
          { key: '', val: Math.pow(10, 0) },
        ]
    
        const result = []
        let current = converted
        units.forEach(unit => {
          const numbers = Math.floor(current / unit.val)
          if (numbers >= 1) {
            current -= numbers * unit.val
            result.push(`${numbers.toLocaleString()}${unit.key}`)
          }
        })
    
        return result.slice(0, numKorUnits).join(' ')
      }
    },
  },
}