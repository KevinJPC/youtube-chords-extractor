export const checkIsCurrentChord = ({ currentIndex, lastIndex, timestamp, nextTimestamp, currentTime }) => {
  return (nextTimestamp && timestamp <= currentTime && currentTime < nextTimestamp) || // is current
  (currentIndex === 0 && currentTime < timestamp) || // is first beat
  (currentIndex === lastIndex && currentTime >= timestamp) // is last beat
}
