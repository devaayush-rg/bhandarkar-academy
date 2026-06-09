import { NavLink } from 'react-router-dom'

/**
 * Site-wide navigation bar.
 * TODO: Replace "Bhandarkar Academy" with the actual institution name if different.
 */
function Navbar() {
  return (
    <nav aria-label="Main navigation">
      <div className="nav-inner">
        <NavLink to="/" className="nav-brand">
          {/* TODO: Replace with real institution name */}
          Bhandarkar Academy
        </NavLink>
        <ul>
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/courses">Courses</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
