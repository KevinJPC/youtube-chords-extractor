/* The regular expression videoIdRegex matches the following YouTube URL formats of interest:
  ** - Short YouTube URL: https://youtu.be/VIDEO_ID
  ** - Standard YouTube URL and additional parameters: https://www.youtube.com/watch?v=VIDEO_ID
  ** - Embedded YouTube URL: https://www.youtube.com/embed/VIDEO_ID
  ** - YouTube URL in 'v' format: https://www.youtube.com/v/VIDEO_ID
  ** - YouTube Music URL and additional parameters: https://music.youtube.com/watch?v=VIDEO_ID
  ** - YouTube Shorts URL: https://www.youtube.com/shorts/VIDEO_ID
  */
export const getYoutubeId = (url) => {
  const videoIdRegex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/(?:watch\?v=)?|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/)|music\.youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
  const match = url.match(videoIdRegex)
  return match ? match[1] : null
}
