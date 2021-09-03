const queryBuilder = () => ({
  queryParams: {},

  limit: function(limit) {
    this.queryParams.limit = limit
    return this
  },

  offset: function(offset) {
    this.queryParams.offset = offset
    return this
  },

  // 일단은 exp 직접사용하도록 구현
  where: function(exp) {
    this.queryParams.where = encodeURI(exp)
    return this
  },

  sort: function(sort) {
    this.queryParams.sort = sort
    return this
  },

  order: function(order) {
      this.queryParams.order = order
      return this
  },

  build: function() {
    return JSON.parse(JSON.stringify(this.queryParams))
  },

  base: function() {
    this.limit(20)
    this.sort('id')
    this.order('desc')
    return this
  },
})

export default queryBuilder