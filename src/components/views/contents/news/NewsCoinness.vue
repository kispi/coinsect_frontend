<template>
  <div class="news-coinness">
    <NewsCoinnessFeeds/>
    <!-- <NewsCoinnessArticles/> -->
    <PoweredBy :by="'coinness'" :link="'https://coinness.live'" class="m-t-24"/>
  </div>
</template>

<script>
// import NewsCoinnessArticles from './NewsCoinnessArticles'
import NewsCoinnessFeeds from './NewsCoinnessFeeds'

export default {
  components: {
    // NewsCoinnessArticles,
    NewsCoinnessFeeds,
  },
}
</script>

<style lang="scss" scoped>
.news-coinness {

}
</style>