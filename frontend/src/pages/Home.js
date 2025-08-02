import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/common.css';

function Home() {
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <img 
            src="/assets/wizard-programmer.png" 
            alt="Wizard Programmer" 
            style={{ 
              maxWidth: '400px', 
              width: '100%',
              mixBlendMode: 'multiply'
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Home; 