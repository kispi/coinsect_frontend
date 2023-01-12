<template>
  <div class="halving-table">
    <table>
      <thead>
        <tr>
          <th>{{ $translate('NUM_HALVING') }}</th>
          <th>{{ $translate('HALVING_DATE') }}</th>
          <th v-if="!$store.getters.isMobile">{{ $translate('HALVING_BLOCK') }}</th>
          <th>{{ $translate('BLOCK_REWARD') }}</th>
          <th v-if="!$store.getters.isMobile">{{ $translate('TO_BE_MINED') }}</th>
          <th>{{ $translate('ACCUMULATED_MINED') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          :class="{'selected': currentHalving === idx}"
          :key="row.date"
          v-for="(row, idx) in halvingTable">
          <td>{{ idx }}</td>
          <td>{{ row.date }}</td>
          <td v-if="!$store.getters.isMobile">{{ row.halvingBlock.toLocaleString() }}</td>
          <td>{{ row.reward.toLocaleString(undefined, { minimumFractionDigits: 8 }) }}</td>
          <td v-if="!$store.getters.isMobile">{{ row.toBeMined.toLocaleString() }}</td>
          <td>{{ row.accumulatedMined.toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    currentHalving: Number,
  },
  setup() {
    const eightPrecision = v => Math.round(v * Math.pow(10, 8)) / Math.pow(10, 8)

    const halvingTable = computed(() => {
      const blocksInCycle = 210000
      const baseReward = 50
      const table = []
      for (let i = 0;; i++) {
        const reward = eightPrecision(baseReward / Math.pow(2, i))
        table.push({
          date: 2008 + 4 * i,
          halvingBlock: blocksInCycle * i,
          toBeMined: eightPrecision(reward * blocksInCycle),
          accumulatedMined: 0,
          reward,
        })
        if (reward <= 0.00000001) break
      }
      table.forEach((row, i) => row.accumulatedMined = eightPrecision(row.toBeMined + (table[i - 1] || {}).accumulatedMined || row.toBeMined))
      table[0].date = '2009-01-03 (Genesis)'
      table[1].date = '2012-11-28'
      table[2].date = '2016-07-09'
      table[3].date = '2020-05-11'
      return table
    })

    return {
      halvingTable,
    }
  },
}
</script>

<style lang="scss" scoped>
.halving-table {
  table {
    width: 100%;

    td,
    th {
      padding: 4px;
    }

    th {
      background: var(--background-light);
    }

    tr.selected {
      background: var(--bitcoin);
      color: var(--white);
      font-weight: 700;
    }
  }
}
</style>