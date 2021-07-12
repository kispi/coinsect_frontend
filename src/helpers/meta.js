const removeExisting = id => {
  const existingDom = document.getElementById(id)
  if (existingDom) document.head.removeChild(existingDom)
}

const appendMetaTags = (tags, content) => tags.forEach(tag => {
  removeExisting(tag.id)
  const metaTag = document.createElement('meta')
  if (tag.property) metaTag.setAttribute('property', tag.property)
  if (tag.name) metaTag.setAttribute('name', tag.name)
  metaTag.setAttribute('content', content)
  metaTag.setAttribute('id', tag.id)
  document.head.appendChild(metaTag)
})

const meta = {
  setDocumentTitle: title => {
    if (!title) return

    document.title = title
    appendMetaTags([
      { id: 'meta-og-title', property: 'og:title' },
      { id: 'meta-twitter-title', property: 'twitter:title' },
    ], title)
  },
  renderDescription: description => {
    const content = description || `'코인충'은 코인 시세, 프리미엄, 최신 뉴스, 게시판 등을 제공하는 대한민국 No.1 암호자산 커뮤니티입니다.`
    appendMetaTags([
      { id: 'meta-description', name: 'description' },
      { id: 'meta-og-description', property: 'og:description' },
      { id: 'meta-twitter-description', property: 'twitter:description' },
    ], content)
  },
  renderOgImage: imageUrl => {
    appendMetaTags([
      { id: 'meta-og-image', property: 'og:image'},
      { id: 'meta-twitter-image', property: 'twitter:image' },
    ], imageUrl)
  },
  renderCanonicalLink: currentRoute => {
    const url = `${window.location.origin}${currentRoute.path}`
    removeExisting('link-rel-canonical')
    const linkRelCanonical = document.createElement('link')
    linkRelCanonical.setAttribute('rel', 'canonical')
    linkRelCanonical.setAttribute('href', url)
    linkRelCanonical.setAttribute('id', 'link-rel-canonical')
    document.head.appendChild(linkRelCanonical)

    appendMetaTags([
      { id: 'meta-og-url', property: 'og:url'},
      { id: 'meta-twitter-url', property: 'twitter:url' },
    ], url)
  },
}

export default meta