<template>
  <div class="view-marketcaps default-page-padding">
    <div class="source">
      출처
      <AppDropdown
        :dropdownItems="sources"
        @select-dropdown-item="setSource"
      />
    </div>
    <component :is="componentIs"/>
  </div>
</template>

<script>
import { computed, getCurrentInstance, ref } from 'vue'
import MarketcapsUpbit from './MarketcapsUpbit'
import MarketcapsCoinmarketcap from './MarketcapsCoinmarketcap'

export default {
  components: {
    MarketcapsUpbit,
    MarketcapsCoinmarketcap,
  },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const source = ref('upbit')

    const sources = ref(['upbit', 'coinmarketcap'].map(key => ({ key })))

    const componentIs = computed(() => `Marketcaps${plugins.$helpers.template.case.toCapital(source.value)}`)

    const setSource = dropdownItem => source.value = dropdownItem.key

    return {
      sources,
      componentIs,
      setSource,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-marketcaps {
  .source {
    display: flex;
    align-items: center;
  }
}
</style>