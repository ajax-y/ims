import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import './Login.css';

function Login({ onLogin }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!userId || !password) {
      setError('Please enter User ID and Password');
      return;
    }

    const user = loginUser(userId, password);

    if (user) {
      onLogin(user);
    } else {
      setError('Invalid User ID or Password. Please try again.');
    }
  };

  return (
    <div className="login-container">
      {/* Left Square */}
      <div className="login-left">
        {/* Placeholder for real logo, using a text base or looking for public asset */}
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="RIT Logo"
          className="login-logo"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none'; // hide if not found
          }}
        />
        <p className="login-left-text">
          Rajalakshmi Institute of Technology is an engineering college in Chennai, Tamil Nadu, India. RIT is approved by AICTE and affiliated with Anna University, Chennai and accredited with A++ Grade in NAAC.
        </p>
      </div>

      {/* Right Square */}
      <div className="login-right">
        <div className="login-card">
          <h2 className="login-title">Login</h2>

          {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="userId">User ID</label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
