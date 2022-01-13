<template>
  <div class="view-community">
    <div class="flex-row flex-between items-center">
      <ButtonCommunity/>
      <button
        @click="$router.push('/community/write')"
        class="btn btn-primary"
        v-html="$translate('WRITE')"
      />
    </div>
    <TablePosts/>
  </div>
</template>