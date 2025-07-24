import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/common.css';

function Home() {
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <h1 className="page-title">Milan R Shah</h1>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <img 
            src="https://via.placeholder.com/300x200?text=Welcome" 
            alt="Welcome" 
            style={{ maxWidth: '100%', borderRadius: '8px' }}
          />
        </div>
      </div>
    </div>
  );
}

export default Home; 