import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';

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

  if (!token) {
    return (
      <div>
        <h1>Personal Trainer Fitness Tracker</h1>
        {signupSuccess && (
          <p style={{ color: 'green' }}>Account created successfully! Please log in.</p>
        )}
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
      <button onClick={handleLogout}>Logout</button>
      <Dashboard goal={goal} />
    </div>
  );
}

export default App;
