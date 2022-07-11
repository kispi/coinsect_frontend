<template>
  <div class="table-richlist">
    <div class="table-title"><AppImg :src="$store.getters.symbols[symbol].thumb" :alt="symbol"/>{{ symbol }}</div>
    <table>
      <thead>
        <tr>
          <th>{{ $translate('RICHLIST_BALANCE_BETWEEN') }}</th>
          <th>{{ $translate('RICHLIST_ADDRESSES') }}</th>
          <th>{{ $translate('RICHLIST_ADDRESSES_RATIO') }}</th>
          <th>{{ $translate('RICHLIST_BALANCE') }}</th>
          <th>{{ $translate('RICHLIST_VALUATION') }}</th>
          <th>{{ $translate('RICHLIST_DOMINANCE') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          :key="idx"
          v-for="(row, idx) in data">
          <td>{{ row.balanceBetween }}</td>
          <td>{{ row.addressesNum.toLocaleString() }}</td>
          <td>{{ row.addressesRatio }}% ({{ row.addressesRatioTotal }})%</td>
          <td>{{ row.balance.toLocaleString() }} {{ symbol }}</td>
          <td>{{ $helpers.currency() }} {{ $helpers.number.pretty.cap({ cap: row.valuationUsd, baseCurrency: 'usd' }) }}</td>
          <td>{{ row.dominance }}% ({{ row.dominanceTotal }})%</td>
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
    margin-bottom: 8px;

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

    &:not(:first-child) {
      text-align: right;
    }
  }
}
</style>