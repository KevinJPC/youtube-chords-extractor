export const checkIsCurrentChord = ({ currentIndex, lastIndex, timestamp, nextTimestamp, currentTime }) => {
  const isDuringBeatDuration = (nextTimestamp && timestamp <= currentTime && currentTime < nextTimestamp)
  const isBeforeFirstBeat = (currentIndex === 0 && currentTime < timestamp)
  const isAfterLastBeat = (currentIndex === lastIndex && currentTime >= timestamp)
  return isDuringBeatDuration || isBeforeFirstBeat || isAfterLastBeat
}
