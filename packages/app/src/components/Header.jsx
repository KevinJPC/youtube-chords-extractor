import { Link } from 'wouter'
import './Header.css'

export const Header = () => {
  return (
    <header className='header'>
      <Link to='/' className='logo'>
        C<span className='logo__accent'>#</span>ords
      </Link>
    </header>
  )
}
