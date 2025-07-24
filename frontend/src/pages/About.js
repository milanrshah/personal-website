import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/common.css';

function About() {
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <h1 className="page-title">About</h1>
        <p className="page-text">
          Welcome to my personal website! I'm passionate about technology, innovation, and creating meaningful solutions. 
          This space serves as a platform to share my thoughts, projects, and experiences.
        </p>
        <p className="page-text">
          I believe in continuous learning and pushing the boundaries of what's possible. 
          Whether it's through coding, writing, or collaboration, I'm always excited to explore new ideas and share them with others.
        </p>
      </div>
    </div>
  );
}

export default About; 