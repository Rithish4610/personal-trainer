import React, { useState } from 'react';
import axios from 'axios';

function Signup({ onSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [weight, setWeight] = useState('');
  const [dob, setDob] = useState('');
  const [goal, setGoal] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      await axios.post('http://localhost:4000/api/signup', { username, password, weight: parseFloat(weight), dob, goal });
      setSuccess(true);
    } catch (err) {
      setError('Signup failed. Username may already exist.');
    } finally {
      setLoading(false);
    }
  };

  const goals = [
    { value: 'fat loss', label: '🔥 Fat Loss', desc: 'Burn calories and lose weight' },
    { value: 'muscle', label: '💪 Build Muscle', desc: 'Gain strength and size' },
    { value: 'general fitness', label: '🏃 General Fitness', desc: 'Stay active and healthy' }
  ];

  return (
    <div>
      <h2 className="auth-title">Join the Squad! 🎯</h2>
      <p className="auth-subtitle">Start your transformation today</p>

      {success ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎉</div>
          <h3 style={{ marginBottom: '15px', color: '#00d4aa' }}>Account Created!</h3>
          <p style={{ color: '#636e72', marginBottom: '25px' }}>
            Welcome to the fitness family. Let's crush those goals!
          </p>
          <button onClick={onSignup} className="btn btn-success btn-lg">
            <span>🚀</span> Let's Go!
          </button>
        </div>
      ) : (
        <>
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
                placeholder="Choose a username" 
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
                placeholder="Create a strong password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Your Weight (kg)</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  className="form-input"
                  placeholder="Enter your weight" 
                  value={weight} 
                  onChange={e => setWeight(e.target.value)} 
                  min="20"
                  max="300"
                  step="0.1"
                  required 
                  style={{ paddingRight: '50px' }}
                />
                <span style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#636e72',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>kg</span>
              </div>
              <small style={{ color: '#636e72', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                ⚖️ We'll use this to personalize your nutrition goals
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input 
                type="date" 
                className="form-input"
                value={dob} 
                onChange={e => setDob(e.target.value)} 
                max={new Date().toISOString().split('T')[0]}
                required 
              />
              <small style={{ color: '#636e72', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                🎂 Helps us calculate your daily calorie needs
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">What's Your Goal?</label>
              <div style={{ display: 'grid', gap: '12px', marginTop: '8px' }}>
                {goals.map(g => (
                  <label 
                    key={g.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '16px 20px',
                      background: goal === g.value ? 'rgba(255, 107, 53, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      border: `2px solid ${goal === g.value ? '#ff6b35' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="goal" 
                      value={g.value}
                      checked={goal === g.value}
                      onChange={e => setGoal(e.target.value)}
                      style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '28px' }}>{g.label.split(' ')[0]}</span>
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '2px' }}>{g.label.split(' ').slice(1).join(' ')}</div>
                      <div style={{ fontSize: '12px', color: '#636e72' }}>{g.desc}</div>
                    </div>
                    {goal === g.value && (
                      <span style={{ marginLeft: 'auto', color: '#ff6b35', fontSize: '20px' }}>✓</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? (
                <>
                  <div className="loading-spinner" style={{width: '20px', height: '20px', borderWidth: '2px'}}></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <span>💪</span> Create Account
                </>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default Signup;
