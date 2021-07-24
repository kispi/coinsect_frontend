<template>
  <div class="settings-panel">
    <div
      class="setting-item"
      :key="setting.key"
      v-for="setting in settings">
      <div class="key" v-html="$translate(setting.key)"/>
      <div class="values">
        <div
          @click="onClickValue(setting.key, o.val)"
          class="value"
          :class="{'active': o.$$selected}"
          :key="o.val"
          v-for="o in setting.values"
          v-html="$translate(o.val)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const settings = computed(() => [{
      key: 'LANGUAGE',
      values: ['kr', 'en'].map(val => ({ val, $$selected: store.getters.translation.locale === val })),
    }, {
      key: 'CURRENCY',
      values: ['krw', 'usd'].map(val => ({ val, $$selected: store.getters.settings.currency === val })),
    }, {
      key: 'THEME',
      values: ['dark', 'light', 'bybit'].map(val => ({ val, $$selected: store.getters.settings.theme === val })),
    }])

    const onClickValue = (key, value) => {
      if (key === 'LANGUAGE') {
        store.commit('setLocale', value)
        return
      }

      if (key === 'CURRENCY') {
        store.commit('setSettings', { currency: value })
        return
      }

      if (key === 'THEME') {
        store.commit('setSettings', { theme: value })
        return
      }
    }

    return {
      settings,
      onClickValue,
    }
  },
}
</script>

<style lang="scss" scoped>
.settings-panel {
  background: var(--background-base);
  border: 1px solid var(--text-base);
  border-radius: 4px;
  width: 240px;
  color: var(--text-stress);

  .setting-item {
    display: flex;
    align-items: center;
    padding: 4px 12px;

    .key {
      width: 80px;
    }

    .values {
      display: flex;
      flex: 1;

      .value {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        border-top: 1px solid var(--text-stress);
        border-bottom: 1px solid var(--text-stress);
        border-left: 1px solid var(--text-stress);
        cursor: pointer;
        flex: 1;

        &:last-child {
          border-right: 1px solid var(--text-stress);
        }

        &:hover {
          background: var(--brand-primary-hover-bg);
        }

        &.active {
          color: var(--brand-primary);
          font-weight: 700;
        }
      }
    }
  }
}
</style>