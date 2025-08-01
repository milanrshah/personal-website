import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/common.css';

function Projects() {
  const projects = [
    {
      name: "NFL Play by Play Analysis"
    },
    {
      name: "Using a Logarithmic Machine Learning Auto ARIMA Model to Chart Pricing Trends in Cardiac Surgery"
    },
    {
      name: "Onitama AI"
    },
    {
      name: "NCAA March Madness Model"
    },
    {
      name: "Risk Game",
      github: "https://github.com/robertl9/OCamlRisk"
    },
    {
      name: "Vote Civic Duty",
      github: "https://github.com/abdullah248/CS4300_Flask_template_ai248psb77mrs282ork6"
    }
  ];

  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <h1 className="page-title">Projects</h1>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0, 
          marginTop: '1.5rem',
          fontSize: '0.95rem',
          lineHeight: '1.4'
        }}>
          {projects.map((project, index) => (
            <li key={index} style={{ 
              marginBottom: '0.5rem',
              color: '#374151'
            }}>
              {project.pdf ? (
                <a 
                  href={project.pdf} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#1e3a8a',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  {project.name}
                </a>
              ) : project.github ? (
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#1e3a8a',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  {project.name}
                </a>
              ) : (
                project.name
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Projects; 