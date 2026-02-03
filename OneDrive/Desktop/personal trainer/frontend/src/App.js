import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [goal, setGoal] = useState(localStorage.getItem('goal') || '');
  const [showSignup, setShowSignup] = useState(false);

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
  };

  if (!token) {
    return (
      <div>
        <h1>Personal Trainer Fitness Tracker</h1>
        {showSignup ? (
          <>
            <Signup onSignup={handleSignup} />
            <button onClick={() => setShowSignup(false)}>Back to Login</button>
          </>
        ) : (
          <>
            <Login onLogin={handleLogin} />
            <button onClick={() => setShowSignup(true)}>Sign Up</button>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      <p>Goal: {goal || 'Not set'}</p>
      <button onClick={handleLogout}>Logout</button>
      {/* Dashboard and tracker components will go here */}
    </div>
  );
}

export default App;
