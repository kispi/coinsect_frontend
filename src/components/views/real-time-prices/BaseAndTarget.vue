<template>
  <div class="base-and-target">
    <div class="base-exchange">
      {{ $translate('BASE_EXCHANGE') }}
      <AppDropdown
        :dropdownItems="bases"
        @select-dropdown-item="o => $emit('change-base-exchange', o.key)"
      />
    </div>
    <div class="target-exchange">
      {{ $translate('TARGET_EXCHANGE') }}
      <AppDropdown
        :dropdownItems="targets"
        @select-dropdown-item="o => $emit('change-target-exchange', o.key)"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const bases = ref(['upbit'].map(key => ({ key, img: require(`@/assets/images/${key}.svg`) })))

    const targets = ref(['binance'].map(key => ({ key, img: require(`@/assets/images/${key}.svg`) })))

    return {
      bases,
      targets,
    }
  }
}
</script>

<style lang="scss" scoped>
.base-and-target {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .base-exchange,
  .target-exchange {
    display: flex;
    align-items: center;
  }
}
</style>