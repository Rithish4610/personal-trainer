import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/api/login', { username, password });
      onLogin(res.data.token, res.data.goal, res.data.weight, res.data.dob, res.data.username);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="auth-title">Welcome Back! 👋</h2>
      <p className="auth-subtitle">Sign in to continue your fitness journey</p>
      
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">❌</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input 
            type="text" 
            className="form-input"
            placeholder="Enter your username" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-input"
            placeholder="Enter your password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
          {loading ? (
            <>
              <div className="loading-spinner" style={{width: '20px', height: '20px', borderWidth: '2px'}}></div>
              Signing in...
            </>
          ) : (
            <>
              <span>🚀</span> Sign In
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default Login;
