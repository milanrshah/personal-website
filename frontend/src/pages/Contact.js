import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/common.css';

function Contact() {
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <h1 className="page-title">Contact</h1>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '2rem',
          marginTop: '3rem'
        }}>
          <a 
            href="https://www.linkedin.com/in/milan-rshah" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              textDecoration: 'none',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            <img 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" 
              alt="LinkedIn" 
              style={{ width: '24px', height: '24px' }}
            />
          </a>
          <a 
            href="https://github.com/milanrshah" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              textDecoration: 'none',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            <img 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" 
              alt="GitHub" 
              style={{ width: '24px', height: '24px' }}
            />
          </a>
          <a 
            href="https://twitter.com/milan_r_shah" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              textDecoration: 'none',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            <img 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg" 
              alt="Twitter" 
              style={{ width: '24px', height: '24px' }}
            />
          </a>
          <a 
            href="https://www.strava.com/athletes/102709682?utm_source=ios_share&utm_medium=social&share_sig=92715E251754008879&_branch_match_id=1479627446528750259&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXLy4pSixL1EssKNDLyczL1nf3zowMqDIPKg5Lsq8rSk1LLSrKzEuPTyrKLy9OLbINTkxLLMoEACSirGI9AAAA" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              textDecoration: 'none',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            <img 
              src="https://raw.githubusercontent.com/evansharp/strava-icon/51fea8696269ed2960eeefd4b7088f90db8aeba8/strava-icon.svg" 
              alt="Strava" 
              style={{ width: '24px', height: '24px' }}
            />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Contact; 