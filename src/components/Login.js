import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Mock login logic (replace with real API call)
    setTimeout(() => {
      setLoading(false);
      if (username === 'admin' && password === 'cricket123') {
        navigate('/admin');
      } else {
        setError('Invalid username or password');
      }
    }, 900);
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo">🏏</div>
        <h2 className="login-title">Cricket Auction Admin</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <div className="login-error">{error}</div>}
        </form>
      </div>
    </div>
  );
} 