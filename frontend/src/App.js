import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import './styles.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [goal, setGoal] = useState(localStorage.getItem('goal') || '');
  const [showSignup, setShowSignup] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleLogin = (token, goal) => {
    setToken(token);
    setGoal(goal);
    localStorage.setItem('token', token);
    localStorage.setItem('goal', goal);
  };

  const handleLogout = () => {
    setToken('');
    setGoal('');
    localStorage.removeItem('token');
    localStorage.removeItem('goal');
  };

  const handleSignup = () => {
    setShowSignup(false);
    setSignupSuccess(true);
  };

  // Floating particles for background effect
  const Particles = () => (
    <div className="particles">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="particle" />
      ))}
    </div>
  );

  if (!token) {
    return (
      <div className="app-container">
        <Particles />
        <div className="auth-container">
          <div className="auth-wrapper">
            {/* Hero Section */}
            <div className="auth-hero">
              <div className="auth-hero-icon">💪</div>
              <h1>Transform Your Body</h1>
              <p>
                Track your nutrition, crush your fitness goals, and become the 
                best version of yourself. Your personal trainer is here to guide 
                you every step of the way.
              </p>
            </div>

            {/* Form Section */}
            <div className="auth-form-section">
              {signupSuccess && (
                <div className="alert alert-success">
                  <span className="alert-icon">✅</span>
                  Account created successfully! Please log in to continue.
                </div>
              )}

              {showSignup ? (
                <>
                  <Signup onSignup={handleSignup} />
                  <div className="auth-switch">
                    <p>Already have an account?</p>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setShowSignup(false)}
                    >
                      Back to Login
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Login onLogin={handleLogin} />
                  <div className="auth-switch">
                    <p>Don't have an account yet?</p>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowSignup(true);
                        setSignupSuccess(false);
                      }}
                    >
                      Create Account
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Particles />
      
      {/* Header */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">🏋️</div>
          <div>
            <div className="logo-text">FitTracker Pro</div>
            <div className="logo-tagline">Your Personal Trainer</div>
          </div>
        </div>
        <button className="btn btn-danger" onClick={handleLogout}>
          <span>🚪</span> Logout
        </button>
      </header>

      {/* Main Dashboard */}
      <main className="main-content">
        <Dashboard goal={goal} />
      </main>
    </div>
  );
}

export default App;
