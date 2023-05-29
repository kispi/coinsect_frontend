<template>
  <div class="community-header">
    <div class="top">
      <RouterLink to="/community" class="button-community">{{ $translate('COMMUNITY') }}</RouterLink>
      <button
        v-if="withWriteButton"
        @click="$modal.custom({
          component: 'ModalPostEditor',
          options: {
            preventCloseOnClickBackdrop: true,
          },
        })"
        class="btn btn-brd"
        v-html="$translate('WRITE')"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    withWriteButton: Boolean,
  },
}
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