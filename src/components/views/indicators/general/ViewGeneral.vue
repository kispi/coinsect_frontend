<template>
  <div class="view-general">
    <div class="sites">
      <div
        :key="item.link"
        v-for="item in items"
        class="site">
        <a
          :href="item.link"
          target="_blank"
          rel="noreferrer"
          class="title">
          <div>{{ item.title }}</div>
          <i class="fa fa-link"/>
        </a>
        <div class="description" v-html="(item.description || '').trim()"/>
      </div>
    </div>
  </div>
</template>

<script>
import items from './general'

export default {
  setup() {
    return {
      items,
    }
  },
}
</script>

<style lang="scss">
.view-general {
  .site {
    border: 1px solid var(--border-base);
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.16);
    overflow: hidden;

    &:not(:last-child) {
      margin-bottom: 40px;
    }
  }

  .title {
    padding: 8px 16px;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    color: var(--white);
    background: var(--brand-primary-bg);

    &:hover {
      text-decoration: underline;
    }
  }

  .description {
    white-space: pre-line;
    line-height: 20px;
    padding: 8px 16px;

    a {
      color: var(--brand-primary);
      cursor: pointer;
    }
  }
}
</style>