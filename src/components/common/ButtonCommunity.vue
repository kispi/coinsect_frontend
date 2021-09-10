<template>
  <RouterLink to="/community" v-html="$translate('COMMUNITY')" class="button-community"/>
</template>

<style lang="scss" scoped>
.button-community {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-stress);
  margin: 16px 0;
  display: block;
}
</style>