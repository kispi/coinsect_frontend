<template>
  <div class="community-header">
    <div class="top">
      <RouterLink to="/community" class="button-community">{{ helpers.translate('COMMUNITY') }}</RouterLink>
      <button
        v-if="withWriteButton"
        @click="helpers.modal.custom({
          component: 'ModalPostEditor',
          options: {
            preventCloseOnClickBackdrop: true,
          },
        })"
        class="btn btn-brd"
        v-html="helpers.translate('WRITE')"
      />
    </div>
  </div>
</template>

<script setup>
import useGlobalHooks from '@/hooks/global-hooks'

defineProps({
  withWriteButton: {
    type: Boolean,
    default: false,
  },
})

const { helpers } = useGlobalHooks()
</script>

<style lang="scss" scoped>
.community-header {
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .button-community {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-stress);
    display: block;
  }
}
</style>