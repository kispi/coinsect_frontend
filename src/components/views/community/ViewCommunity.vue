<template>
  <div class="view-community">
    <div class="flex-row flex-between items-center">
      <ButtonCommunity/>
      <button
        @click="$router.push('/community/write')"
        class="btn btn-primary m-b-16"
        v-html="$translate('WRITE')"
      />
    </div>
    <TablePosts/>
  </div>
</template>