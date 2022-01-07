const { default: axios } = require('axios')
const { useApp } = require('./helpers')
const useHtmlRenderer = require('./html-renderer')

const handleSSRRequest = async (req, res) => {
  const { app, store, router } = await useApp(req)
  await router.push(req.url)
  await router.isReady()

  // 클라이언트 라우트에 정의된 path들 중에 현재 SSR로 요청된 path와 매치되는게 있는지 체크
  const existingPaths = router.options.routes.map(o => o.path)
  const isEligiblePath = existingPaths.includes(req.path)
  if (!isEligiblePath) {
    try {
      const { url } = await axios.get(`short_urls?key=${req.path.substring(1)}`)
      res.status(302)
      res.redirect(url)
      return
    } catch (e) {
      res.status(404)
    }
  }

  const html = await useHtmlRenderer({ app, store })
  res.setHeader('Content-Type', 'text/html')
  res.send(html)
}

module.exports = {
  handleSSRRequest,
}