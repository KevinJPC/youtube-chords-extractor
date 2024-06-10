import './KeyTransposer.css'
import { TriangleDownIcon, TriangleUpIcon } from './icons'
import { useCustomizedChordsPerBeatsContext } from './CustomizedChordsPerBeatsContext'

export const KeyTransposer = () => {
  const { transposeValue, increaseTransposeValue, decreaseTransposeValue } = useCustomizedChordsPerBeatsContext()
  const signValue = transposeValue >= 0 ? '+' : ''
  return (
    <div className='key-transposer'>
      <button
        className='key-transposer__button'
        onClick={increaseTransposeValue}
      >
        <TriangleUpIcon />
      </button>
      <div className='key-transposer__current-value'>{signValue}{transposeValue}</div>
      <button
        className='key-transposer__button'
        onClick={decreaseTransposeValue}
      >
        <TriangleDownIcon />
      </button>
    </div>
  )
}
