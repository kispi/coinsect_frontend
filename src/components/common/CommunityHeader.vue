<template>
  <div class="community-header">
    <div class="top">
      <RouterLink to="/community" v-html="$translate('COMMUNITY')" class="button-community"/>
      <button
        v-if="withWriteButton"
        @click="$router.push('/community/write')"
        class="btn btn-primary"
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