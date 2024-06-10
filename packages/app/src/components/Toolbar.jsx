import './Toolbar.css'

export const Toolbar = ({ children, className }) => {
  return (
    <menu
      className={`toolbar ${className}`}
    >
      <div className='toolbar__scrollable'>
        {children}
      </div>
    </menu>
  )
}

Toolbar.Option = ({ children, className }) => {
  return (
    <li className={`toolbar__option ${className}`}>
      {children}
    </li>
  )
}
