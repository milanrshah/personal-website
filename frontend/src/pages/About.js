import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/common.css';

function About() {
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <h1 className="page-title">About</h1>
        <div style={{ 
          textAlign: 'center',
          marginTop: '3rem'
        }}>
          <p style={{ 
            fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
            marginBottom: '0.5rem',
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}>
            Software Engineer (aka Wizard on the Keys)
          </p>
          <p style={{ 
            fontSize: 'clamp(0.8rem, 2vw, 1rem)',
            marginBottom: '0.5rem'
          }}>
            nyc
          </p>
          <p style={{ 
            fontSize: 'clamp(0.8rem, 2vw, 1rem)',
            marginBottom: '0'
          }}>
            hobbies: <span style={{ fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)' }}>✈️ 🎾 🏈 🏀 🏃‍♂️ ⛳ 📚 🎬</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default About; 