<template>
  <div
    v-if="useBlankGuide || meta.title || meta.image || meta.description"
    @click="onClickMetaCard(link)"
    class="meta-card"
    :class="{'small': small}">
    <div
      v-if="!meta.title && !meta.image && !meta.description"
      class="empty-meta center p-16">
      웹사이트 {{ link }}에서 유의미한 메타 정보(타이틀, 설명, 이미지)를 찾지 못했습니다 😥
    </div>
    <div
      v-else
      class="meta-image"
      :class="{'has-image': meta.image}">
      <AppImg v-if="meta.image" :src="meta.image" class="overlay"/>
      <div v-else class="center p-16">웹사이트 {{ link }}에서 메타 이미지를 찾지 못했습니다 😥</div>
    </div>
    <div
      v-if="meta.title || meta.description"
      class="meta-info">
      <div v-if="meta.title" class="meta-title" :class="{'lines-1': small}" v-html="meta.title"/>
      <div v-if="meta.description" class="meta-description" :class="{'lines-2': small}" v-html="meta.description"/>
    </div>
  </div>
</template>

<script>
import useSeo from '@/hooks/seo'

export default {
  props: {
    small: Boolean,
    useBlankGuide: Boolean,
    link: String,
    meta: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const { onClickMetaCard } = useSeo()

    return {
      onClickMetaCard,
    }
  },
}
</script>

<style lang="scss" scoped>
.meta-card {
  border: 1px solid var(--border-base);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;

  .meta-image {
    padding-top: 56.25%;
    position: relative;
  }

  .meta-info {
    background: var(--white);
    padding: 8px 12px;
    color: var(--black);
    display: flex;
    flex-direction: column;
    gap: 8px;

    .meta-title {
      font-size: 12px;
      font-weight: 500;
    }

    .meta-description {
      font-size: 10px;
    }
  }
}
</style>