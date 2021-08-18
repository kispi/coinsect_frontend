<template>
  <div class="view-updates">
    <ul
      :key="idx"
      v-for="(update, idx) in updates">
      <div class="date" v-html="update.date"/>
      <li
        :key="idx"
        v-for="(job, idx) in update.jobsDone"
        v-html="job">
      </li>
    </ul>
  </div>
</template>

<script>
import updates from './updates'

export default {
  setup: () => ({
    updates,
  }),
}
</script>

<style lang="scss">
.view-updates {
  padding: var(--app-default-page-padding);
  margin: auto;
  max-width: 992px;
  line-height: 18px;

  ul {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  .date {
    color: var(--text-stress);
    margin-bottom: 8px;
  }
}
</style>