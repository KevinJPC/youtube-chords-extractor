import './Spinner.css'
export const Spinner = ({ size = 24, thickness = 2, className = '' }) => {
  return (
    <div className={`spinner ${className}`}>
      <span
        style={{
          '--size': `${size}px`,
          '--thickness': `${thickness}px`
        }}
        className='spinner__animation'
      />
    </div>
  )
}
