<template>
  <div class="settings-panel">
    <div
      class="setting-item"
      :key="setting.key"
      v-for="setting in settings">
      <div class="key" v-html="$translate(setting.key)"/>
      <div class="values">
        <div
          @click="onClickValue(setting.key, o)"
          class="value"
          :class="{'active': o.$$selected}"
          :key="o.value"
          v-for="o in setting.values"
          v-html="$translate(o.title)"
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
      values: [
        { title: 'KR', value: 'kr' },
        { title: 'EN', value: 'en' },
      ].map(o => ({ ...o, $$selected: store.getters.translation.locale === o.value })),
    }, {
      key: 'CURRENCY',
      values: [
        { title: 'KRW', value: 'krw' },
        { title: 'USD', value: 'usd' },
      ].map(o => ({ ...o, $$selected: store.getters.settings.currency === o.value })),
    }, {
      key: 'THEME',
      values: [
        { title: 'UPBIT', value: 'light' },
        { title: 'BYBIT', value: 'dark' },
      ].map(o => ({ ...o, $$selected: store.getters.settings.theme === o.value })),
    }, {
      key: 'FILTER',
      values: [
        { title: 'ALL', value: 'all' },
        { title: 'FAVORITES', value: 'favorites' },
      ].map(o => ({ ...o, $$selected: store.getters.settings.filter === o.value })),
    }, {
      key: 'TRADINGVIEW',
      values: [
        { title: 'SHOW', value: 'show' },
        { title: 'HIDE', value: 'hide' },
      ].map(o => ({ ...o, $$selected: store.getters.settings.tradingview === o.value })),
    }])

    const onClickValue = (key, setting) => {
      if (key === 'LANGUAGE') {
        store.commit('setLocale', setting.value)
        return
      }

      if (['CURRENCY', 'THEME', 'FILTER', 'TRADINGVIEW'].includes(key)) {
        const o = {}
        o[key.toLowerCase()] = setting.value
        store.commit('setSettings', o)
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
  width: 320px;
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
        transition: none;

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