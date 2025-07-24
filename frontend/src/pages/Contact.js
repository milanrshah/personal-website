import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/common.css';

function Contact() {
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <h1 className="page-title">Contact</h1>
        <p className="page-text">
          I'm always interested in hearing about new opportunities, collaborations, or just connecting with fellow tech enthusiasts.
        </p>
        <div className="card" style={{ marginTop: '2rem' }}>
          <h3 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>Get in Touch</h3>
          <div style={{ color: '#64748b', lineHeight: '1.8' }}>
            <p><strong>Email:</strong> contact@milanrshah.com</p>
            <p><strong>LinkedIn:</strong> linkedin.com/in/milanrshah</p>
            <p><strong>GitHub:</strong> github.com/milanrshah</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact; 