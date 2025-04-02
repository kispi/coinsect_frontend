const youtube = {
  extractVideoId: (youtubeUrl: string) => {
    const match = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?feature=player_embedded&v=|watch\?list=\S+&v=))([\w-]+)/)
    return match && match[1]
  },
  retrieveYouTubeThumbnailFromHTML: (html: string) => {
    const youtubeID = youtube.extractVideoId(html)
    if (!youtubeID) return

    return `https://img.youtube.com/vi/${youtubeID}/0.jpg`
  },
}

export default youtube