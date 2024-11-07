<template>
  <div class="app-snackbar">
    <div
      class="snackbar-item"
      :class="snackbar.class"
      :key="snackbar"
      v-for="snackbar in store.getters.snackbars">
      <div class="snackbar-content">
        <i v-if="snackbar.class === 'info'" class="fal fa-info-circle"/>
        <i v-if="snackbar.class === 'warning'" class="fal fa-exclamation-circle"/>
        <div v-html="snackbar.html"/>
      </div>
      <div class="clickable-icon-wrapper m-l-8">
        <i
          @click="store.commit('removeSnackbar', snackbar)"
          class="fal fa-times"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import useGlobalHooks from '@/hooks/global-hooks'

const { store } = useGlobalHooks()
</script>

<style lang="scss" scoped>
.app-snackbar {
  position: fixed;
  z-index: 6;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .snackbar-item {
    min-width: 280px;
    width: 320px;
    max-width: calc(100vw - 32px);
    padding: 8px 8px 8px 16px;
    border-radius: 4px;
    background: rgba(64, 64, 64, 0.95);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    animation: fade-in 0.5s ease-in-out;

    .snackbar-content {
      color: var(--white);
      font-size: 12px;
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .clickable-icon-wrapper {
      width: 32px;
      height: 32px;
    }

    &.warning {
      background: var(--warning);
    }
  }
}
</style>