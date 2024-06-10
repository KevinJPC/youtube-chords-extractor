import './DetailsList.css'

export const DetailsList = ({ children, className = '' }) => {
  return (
    <ul className={`details-list ${className}`}>
      {children}
    </ul>
  )
}

DetailsList.Item = ({ children, className = '' }) => {
  return (
    <li className={`details-list__item ${className}`}>
      {children}
    </li>
  )
}
