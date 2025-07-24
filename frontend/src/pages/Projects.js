import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/common.css';

function Projects() {
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <h1 className="page-title">Projects</h1>
        <p className="page-text">
          Here you'll find a collection of my projects, ranging from web applications to data analysis and everything in between.
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginTop: '2rem'
        }}>
          <div className="card">
            <h3 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>Personal Website</h3>
            <p style={{ color: '#64748b' }}>A React-based personal website with Flask backend, featuring NFL QB rankings and blog functionality.</p>
          </div>
          <div className="card">
            <h3 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>Coming Soon</h3>
            <p style={{ color: '#64748b' }}>More projects coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects; 