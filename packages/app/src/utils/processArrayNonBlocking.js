// based on: https://stackoverflow.com/questions/10344498/best-way-to-iterate-over-an-array-without-blocking-the-ui#answer-10344560
export function processArrayNonBlocking (array, fn, chunk = 100) {
  let isCancelled = false
  processArrayNonBlocking.cancel = () => {
    isCancelled = true
  }
  return new Promise((resolve, reject) => {
    const newArray = []
    let indexToProcess = 0

    function processArrayChunk () {
      let reminingIndexes = chunk

      while (reminingIndexes > 0 && indexToProcess < array.length) {
        if (isCancelled) break
        newArray.push(fn?.(array[indexToProcess], indexToProcess))
        reminingIndexes = reminingIndexes - 1
        indexToProcess = indexToProcess + 1
      }

      if (isCancelled) return reject(new Error('Non-blocking array processing cancelled'))
      if (indexToProcess < array.length) return window.requestAnimationFrame(processArrayChunk)
      resolve(newArray)
    }
    processArrayChunk()
  })
}
