<template>
  <div class="view-community view-layout-default">
    <ButtonCommunity/>
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
}
</style>