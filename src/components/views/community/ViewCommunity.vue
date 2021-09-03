<template>
  <div class="view-community">
    <TablePosts/>
  </div>
</template>

<script>
import TablePosts from './TablePosts.vue'

export default {
  components: { TablePosts },
}
</script>

<style lang="scss" scoped>
.view-community {
  max-width: 992px;
  margin: auto;
  padding: var(--app-default-page-padding);
}
</style>