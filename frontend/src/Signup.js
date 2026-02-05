import React, { useState } from 'react';
import axios from 'axios';

function Signup({ onSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [goal, setGoal] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      await axios.post('http://localhost:4000/api/signup', { username, password, goal });
      setSuccess(true);
      // Do not immediately call onSignup; let user see success message and click to go back
    } catch (err) {
      setError('Signup failed. Username may already exist.');
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {success ? (
        <>
          <p style={{color:'green'}}>Account created successfully! Please log in.</p>
          <button onClick={onSignup}>Back to Login</button>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <select value={goal} onChange={e => setGoal(e.target.value)}>
              <option value="">Select Goal (optional)</option>
              <option value="fat loss">Fat Loss</option>
              <option value="muscle">Muscle</option>
              <option value="general fitness">General Fitness</option>
            </select>
            <button type="submit">Sign Up</button>
          </form>
          {error && <p style={{color:'red'}}>{error}</p>}
        </>
      )}
    </div>
  );
}

export default Signup;
