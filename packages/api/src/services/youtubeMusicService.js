import { Innertube } from 'youtubei.js'

/*
** YouTube Music appears to be the most accurate way to search specifically for musical results in particular videos and songs,
** but it is not 100% accurate.
*/
export class YoutubeMusicService {
  #ytMusic
  constructor () {
    this.#init()
  }

  async #init () {
    this.#ytMusic = (await Innertube.create()).music
  }

  /* Search for songs and videos with specific queries for each one.
  ** Each query return maximum 20 results, giving a total of 40
  */
  async search ({ query }) {
    const songsPromise = this.#ytMusic.search(query, { type: 'song' })
    const videosPromise = this.#ytMusic.search(query, { type: 'video' })
    const [videosResponse, songsResponse] = await Promise.allSettled([videosPromise, songsPromise])
      .then(responses => responses.map(res => res?.value || {}))
    // mapped the response to get the actual videos/songs and the info of interest
    const mappedResponses = (response) => {
      const results = response?.contents?.find(cont => cont.type === 'MusicShelf')?.contents?.reduce((resultsAcc, result) => {
        if (result?.id && result?.title && result?.duration?.seconds) {
        // Youtubei returns some duplicated results
          const isDuplicated = resultsAcc.findIndex(v => v.id === result.id) !== -1
          return isDuplicated ? resultsAcc : [...resultsAcc, { id: result.id, title: result.title, duration: result.duration.seconds }]
        }
        return resultsAcc
      }, []) || []
      return results
    }
    const videos = mappedResponses(videosResponse)
    const songs = mappedResponses(songsResponse)

    /* interleaves the videos and songs so the client does not see a noticeable distinction between them,
    ** while trying to keep the order from the response */
    const results = []
    while (songs.length > 0 && videos.length > 0) {
      const video = videos.shift()
      const song = songs.shift()
      if (video.duration > song.duration) {
        results.push(video, song)
      } else {
        results.push(song, video)
      }
    }
    results.push(...videos, ...songs)
    return results
  }

  async findVideo ({ id }) {
    try {
      const res = await this.#ytMusic.getInfo(id)
      // Check if it is playable with youtube music
      if (res?.playability_status?.status !== 'OK') return undefined
      return res?.basic_info?.id && res?.basic_info?.title && res?.basic_info?.duration
        ? {
            id: res.basic_info.id,
            title: res.basic_info.title,
            duration: res.basic_info.duration
          }
        : undefined
    } catch (error) {
      console.log(error)
      return undefined
    }
  }
}

export const youtubeMusicService = new YoutubeMusicService()
