import { Link } from 'wouter'

export const ConditionalLink = ({ children, isNavigable = false, className = '', to = '#' }) => {
  return (
    <>
      {(isNavigable)
        ? (
          <Link to={to} className={className}>
            {children}
          </Link>
          )
        : children}
    </>
  )
}
