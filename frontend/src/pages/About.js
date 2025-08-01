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
            fontSize: '1.2rem',
            marginBottom: '0.5rem'
          }}>
            Software Engineer (aka Wizard on the Keys)
          </p>
          <p style={{ 
            fontSize: '1rem',
            marginBottom: '0.5rem'
          }}>
            nyc
          </p>
          <p style={{ 
            fontSize: '1rem',
            marginBottom: '0'
          }}>
            hobbies: <span style={{ fontSize: '1.1rem' }}>✈️ 🎾 🏈 🏀 🏃‍♂️ ⛳ 📚 🎬</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default About; 