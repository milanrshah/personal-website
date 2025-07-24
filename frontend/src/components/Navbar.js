import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-buttons">
        <Link to="/" className="navbar-title">
          milanrshah
        </Link>
        <Link to="/projects" className={location.pathname === '/projects' ? 'active' : ''}>
          Projects
        </Link>
        <div className="dropdown">
          <Link to="/blog" className={`dropdown-toggle ${location.pathname.startsWith('/blog') ? 'active' : ''}`}>
            Blog ▼
          </Link>
          <div className="dropdown-menu">
            <Link to="/blog/qb-rankings" className="dropdown-item">
              NFL QB Rankings
            </Link>
          </div>
        </div>
        <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
          About
        </Link>
        <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
          Contact
        </Link>
      </div>
    </nav>
  );
}

export default Navbar; 