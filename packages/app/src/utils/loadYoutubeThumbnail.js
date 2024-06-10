export const loadYoutubeThumbnail = (src, minWidth = 121) => {
  return new Promise((resolve, reject) => {
    const image = new window.Image()

    image.onload = () => {
      if (image.naturalWidth >= minWidth) {
        resolve(image)
      } else {
        reject(new Error(`Image ${src} doesn't exists`))
      }
    }
    image.onerror = () => {
      reject(new Error(`Image ${src} doesn't exists`))
    }
    image.src = src
  })
}
