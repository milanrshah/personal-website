import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Auth from './Auth';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className="navbar">
        <div className="mobile-menu-toggle" onClick={toggleSidebar}>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </div>

        <div className="navbar-buttons">
          <Link to="/" className="navbar-title">
            <img 
              src="/assets/wizard-programmer.png" 
              alt="Wizard on the Keys" 
              style={{ 
                height: '32px', 
                width: 'auto',
                verticalAlign: 'middle'
              }}
            />
          </Link>
          <Link to="/projects" className={location.pathname === '/projects' ? 'active' : ''}>
            Projects
          </Link>
          <div className="dropdown">
            <span className="dropdown-toggle">
              Blog
            </span>
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
        <div className="navbar-auth">
          <Auth />
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img 
            src="/assets/wizard-programmer.png" 
            alt="Wizard on the Keys" 
            style={{ 
              height: '32px', 
              width: 'auto',
              verticalAlign: 'middle'
            }}
          />
          <button className="close-sidebar" onClick={toggleSidebar}>×</button>
        </div>
        <div className="sidebar-nav">
          <Link to="/" onClick={toggleSidebar} className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
          <Link to="/projects" onClick={toggleSidebar} className={location.pathname === '/projects' ? 'active' : ''}>
            Projects
          </Link>
          <div className="sidebar-dropdown">
            <span className="sidebar-dropdown-toggle">
              Blog
            </span>
            <div className="sidebar-dropdown-menu">
              <Link to="/blog/qb-rankings" onClick={toggleSidebar} className="sidebar-dropdown-item">
                NFL QB Rankings
              </Link>
            </div>
          </div>
          <Link to="/about" onClick={toggleSidebar} className={location.pathname === '/about' ? 'active' : ''}>
            About
          </Link>
          <Link to="/contact" onClick={toggleSidebar} className={location.pathname === '/contact' ? 'active' : ''}>
            Contact
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
}

export default Navbar; 