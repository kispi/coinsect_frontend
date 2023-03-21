<template>
  <div class="table-richlist">
    <div v-if="$store.getters.symbols[symbol]" class="table-title"><AppImg :src="$store.getters.symbols[symbol].thumb" :alt="symbol"/>{{ symbol }}</div>
    <table>
      <thead>
        <tr>
          <th>{{ $translate('RICHLIST_BALANCE_BETWEEN') }}</th>
          <th>{{ $translate('RICHLIST_ADDRESSES') }}</th>
          <th>{{ $translate('RICHLIST_ADDRESSES_RATIO') }}</th>
          <th>{{ $translate('RICHLIST_BALANCE') }}</th>
          <th v-if="!$store.getters.isMobile">{{ $translate('RICHLIST_VALUATION') }}</th>
          <th>{{ $translate('RICHLIST_DOMINANCE') }}</th>
        </tr>
      </thead>
      <tbody class="f-mono">
        <tr
          :key="idx"
          v-for="(row, idx) in data">
          <td>{{ row.balanceBetween }}</td>
          <td>{{ row.addressesNum.toLocaleString() }}</td>
          <td>{{ row.addressesRatio }}% <span>({{ row.addressesRatioTotal }})%</span></td>
          <td>{{ row.balance.toLocaleString() }} <span>{{ symbol }}</span></td>
          <td v-if="!$store.getters.isMobile">{{ $helpers.currency() }} {{ $helpers.number.pretty.cap({ cap: row.valuationUsd, baseCurrency: 'usd' }) }}</td>
          <td>{{ row.dominance }}% <span>({{ row.dominanceTotal }})%</span></td>
        </tr>
      </tbody>
    </table>
    <slot/>
  </div>
</template>

<script>
export default {
  props: {
    data: null,
    symbol: String,
  },
}
</script>

<style lang="scss" scoped>
.table-richlist {
  .table-title {
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    color: var(--text-stress);
    margin-bottom: 16px;

    img {
      width: 20px;
      margin-right: 8px;
    }
  }

  table {
    width: 100%;
    color: var(--text-stress);
  }

  thead {
    background: var(--background-light);
  }

  td,
  th {
    padding: 8px;
    text-align: initial;
    white-space: nowrap;

    &:not(:first-child) {
      text-align: right;
    }
  }

  @media (max-width: 479px) {
    font-size: 12px;

    td,
    th {
      padding: 8px 4px;

      span {
        display: none;
      }
    }
  }
}
</style>