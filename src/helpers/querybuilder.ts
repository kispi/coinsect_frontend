const queryBuilder = () => ({
  queryParams: {} as {
    limit: number
    offset: number
    query: string
    where: string
    sort: string
    order: string
  },

  limit: function(limit: number) {
    this.queryParams.limit = limit
    return this
  },

  offset: function(offset: number) {
    this.queryParams.offset = offset
    return this
  },

  query: function(query: string) {
    this.queryParams.query = query
    return this
  },

  // 일단은 exp 직접사용하도록 구현
  where: function(exp: string) {
    this.queryParams.where = encodeURI(exp)
    return this
  },

  sort: function(sort: string) {
    this.queryParams.sort = sort
    return this
  },

  order: function(order: string) {
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