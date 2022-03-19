<template>
  <div class="view-salary">
    <input v-model="raw">
    <div class="m">{{ result.m }}</div>
    <div class="result" v-html="result.calculated"/>
    {{ result }}
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  setup() {
    const f = Math.floor

    const raw = ref(null)

    const tax = y => {
      const r = [12, 46, 88, 150, 300, 500, 1000].map(v => v * Math.pow(10, 6))
      if (y <= r[0]) return y * 0.06
      if (y <= r[1]) return (y - r[0]) * 0.15 + 720000
      if (y <= r[2]) return (y - r[1]) * 0.24 + 5820000
      if (y <= r[3]) return (y - r[2]) * 0.35 + 15900000
      if (y <= r[4]) return (y - r[3]) * 0.38 + 37600000
      if (y <= r[5]) return (y - r[4]) * 0.4 + 94600000
      if (y <= r[6]) return (y - r[5]) * 0.42 + 174600000
      return (y - r[6]) * 0.45 + 384600000
    }

    const result = computed(() => {
      const y = raw.value // 세전연봉

      const a = f(y * 0.045) // 국민연금

      const b = f(y * 0.03495) // 건강보험

      const c = f(b * 0.1227) // 장기요양

      const d = f(y * 0.009) // 고용보험

      const e = tax(raw.value) // 소득세

      const totalTax = (a + b + c + d + e)

      return {
        y, totalTax, m: (y - totalTax) / 12, e,
      }
    })

    return {
      raw,
      result,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-salary {

}
</style>