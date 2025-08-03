import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from '../config';
import './Auth.css';

const Auth = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Load user from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('/api/auth/google', {
        id_token: credentialResponse.credential
      });

      const { token, user: userInfo } = response.data;
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userInfo);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('authChange'));
    } catch (error) {
      console.error('Google auth error:', error);
      alert('Failed to sign in with Google');
    }
  };

  const handleGoogleError = () => {
    console.error('Google Sign-In was unsuccessful');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setShowDropdown(false);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authChange'));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="auth-navbar">
      {!user ? (
        <div className="google-signin-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="filled_white"
            size="small"
            type="icon"
            shape="square"
          />
        </div>
              ) : (
          <div className="user-navbar">
            <div className="user-dropdown">
            <img 
              src={user.picture}
              alt={user.name}
              className="user-avatar-navbar"
              onClick={() => setShowDropdown(!showDropdown)}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
              onLoad={(e) => {
                e.target.nextSibling.style.display = 'none';
              }}
              style={{ 
                width: '32px !important',
                height: '32px !important',
                borderRadius: '50% !important',
                border: '2px solid #F2F0EF !important',
                cursor: 'pointer !important',
                objectFit: 'cover !important',
                display: 'block !important'
              }}
            />
            <div 
              className="user-avatar-navbar"
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ 
                width: '32px !important',
                height: '32px !important',
                borderRadius: '50% !important',
                border: '2px solid #F2F0EF !important',
                cursor: 'pointer !important',
                backgroundColor: '#374151 !important',
                display: 'none !important',
                alignItems: 'center !important',
                justifyContent: 'center !important',
                color: '#F2F0EF !important',
                fontSize: '14px !important',
                fontWeight: 'bold !important'
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            {showDropdown && (
              <div className="user-dropdown-menu">
                <div className="user-dropdown-item">
                  <span className="user-name-dropdown">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="logout-btn-dropdown">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth; 