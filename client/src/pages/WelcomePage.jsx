// src/pages/LoginRegister/WelcomePage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

function WelcomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/home');
  };

  return (
    <div className="welcome-page">
      <div className="centered-content">
        <div className="content-box">
          <h1 className="welcome-title">Welcome</h1>
          <p className="welcome-subtitle">Your one-stop solution for movie booking!</p>
          <button className="login-button" onClick={handleGetStarted}>Get Started</button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
