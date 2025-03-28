<template>
  <div class="settings-panel">
    <div
      class="setting-item"
      :key="setting.key"
      v-for="setting in settings">
      <div class="key" v-html="helpers.translate(setting.key)"/>
      <div class="values">
        <div
          @click="onClickValue(setting.key, o)"
          class="value"
          :class="{'active': o.$$selected}"
          :key="o.value"
          v-for="o in setting.values"
          v-html="helpers.translate(o.title)"
        />
      </div>
    </div>
    <button
      @click="onClickInitSettings"
      class="btn btn-brd"
      v-html="helpers.translate('INIT_SETTINGS')"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

const props = defineProps({
  indices: {
    type: Array,
    default: () => [],
  },
})

const { helpers, store } = useGlobalHooks()

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
    { title: '☀️', value: 'light' },
    { title: '🌙', value: 'dark' },
  ].map(o => ({ ...o, $$selected: store.getters.settings.theme === o.value })),
}, {
  key: 'CHART_FULL_WIDTH',
  values: [
    { title: 'ON', value: true },
    { title: 'OFF', value: false },
  ].map(o => ({ ...o, $$selected: store.getters.settings.chartFullWidth === o.value })),
}, {
  key: 'CHART_TOOL',
  values: [
    { title: 'ON', value: true },
    { title: 'OFF', value: false },
  ].map(o => ({ ...o, $$selected: store.getters.settings.chartTool === o.value })),
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
    { title: `5 ${helpers.translate('SECONDS')}`, value: 5000 },
  ].map(o => ({ ...o, $$selected: store.getters.settings.sortInterval === o.value })),
}].filter((_, idx) => props.indices.length === 0 || props.indices.includes(idx)))

const onClickValue = (key, setting) => {
  const o = {}
  o[helpers.template.case.toCamel(key.toLowerCase())] = setting.value
  store.commit('setSettings', o)
}

const onClickInitSettings = () => {
  helpers.modal.confirm({
    body: helpers.translate('MODAL_INIT_SETTINGS'),
  }).then(idx => {
    if (idx === 1) {
      store.commit('setLoading', { global: true })
      store.dispatch('initSettings')

      setTimeout(() => {
        location.reload()
      }, store.getters.isMobile ? 2000 : 1000)
    }
  })
}
</script>

<style lang="scss" scoped>
.settings-panel {
  background: var(--background-base);
  border: 1px solid var(--border-base);
  border-radius: 4px;
  padding: 16px;
  color: var(--text-stress);

  .btn-brd {
    width: 100%;
    margin-top: 16px;
  }

  .setting-item {
    display: flex;
    align-items: center;
    padding: 4px 12px;

    .key {
      width: 120px;
    }

    .values {
      display: flex;
      gap: 8px;
      flex: 1;

      .value {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        flex: 1;
        transition: none;
        white-space: nowrap;
        cursor: pointer;

        &:hover {
          background: var(--background-light);
        }

        &.active {
          background: var(--background-light);
          font-weight: 700;
        }
      }
    }
  }
}
</style>
