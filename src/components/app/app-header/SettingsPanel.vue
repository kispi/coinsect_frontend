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
    <button
      @click="onClickInitSettings"
      class="btn btn-primary"
      v-html="$translate('INIT_SETTINGS')"
    />
  </div>
</template>

<script>
import { computed, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const settings = computed(() => [{
      key: 'LOCALE',
      values: [
        { title: 'KR', value: 'kr' },
        { title: 'EN', value: 'en' },
      ].map(o => ({ ...o, $$selected: store.getters.settings.locale === o.value })),
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
      key: 'SORT_INTERVAL',
      values: [
        { title: 'REAL_TIME', value: 50 },
        { title: `5 ${plugins.$translate('SECONDS')}`, value: 5000 },
      ].map(o => ({ ...o, $$selected: store.getters.settings.sortInterval === o.value })),
    }, {
      key: 'TRADINGVIEW',
      values: [
        { title: 'SHOW', value: true },
        { title: 'HIDE', value: false },
      ].map(o => ({ ...o, $$selected: store.getters.settings.tradingview.home === o.value })),
    }])

    const onClickValue = (key, setting) => {
      if (key === 'TRADINGVIEW') {
        const tradingview = store.getters.settings.tradingview
        tradingview.home = setting.value
        store.commit('setSettings', { tradingview })
        return
      }

      const o = {}
      o[plugins.$helpers.template.case.toCamel(key.toLowerCase())] = setting.value
      store.commit('setSettings', o)
    }

    const onClickInitSettings = () => {
      plugins.$modal.confirm({
        body: plugins.$translate('MODAL_INIT_SETTINGS'),
      }).then(idx => {
        if (idx === 1) {
          store.dispatch('initSettings')
        }
      })
    }

    return {
      settings,
      onClickValue,
      onClickInitSettings,
    }
  },
}
</script>

<style lang="scss" scoped>
.settings-panel {
  background: var(--background-base);
  border: 1px solid var(--border-base);
  border-radius: 4px;
  width: 320px;
  padding: 16px;
  color: var(--text-stress);

  .btn-primary {
    width: 100%;
    margin-top: 16px;
  }

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
        cursor: pointer;
        flex: 1;
        transition: none;

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