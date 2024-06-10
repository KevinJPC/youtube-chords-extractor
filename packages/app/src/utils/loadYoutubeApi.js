export const LoadYoutubeApi = () => {
  return new Promise((resolve, reject) => {
    if (window?.YT?.Player instanceof Function) {
      resolve(window.YT)
      return
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'

    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    window.onYouTubeIframeAPIReady = () => {
      resolve(window.YT)
    }
  })
}
