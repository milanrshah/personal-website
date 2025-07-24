import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/common.css';

function Blog() {
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <h1 className="page-title">Blog</h1>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginTop: '2rem'
        }}>
          <Link to="/blog/qb-rankings" style={{ textDecoration: 'none' }}>
            <div className="card">
              <h3 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>NFL QB Rankings</h3>
              <p style={{ color: '#64748b' }}>Weekly quarterback rankings and analysis for the NFL season.</p>
            </div>
          </Link>
          <div className="card">
            <h3 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>Coming Soon</h3>
            <p style={{ color: '#64748b' }}>More blog posts coming soon...</p>
          </div>
          <div className="card">
            <h3 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>Coming Soon</h3>
            <p style={{ color: '#64748b' }}>More blog posts coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog; 