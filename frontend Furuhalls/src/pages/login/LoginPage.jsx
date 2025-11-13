import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { validateEmail, validatePassword } from '../../utils/validationUtils';
import './LoginPage.css';

// -------------------------------------------------------------------
// 🔥 PATH RESOLUTION FAILED. 
// Using the public folder strategy (absolute path) instead.
// Ensure your logo file is now in the project's root /public directory.
// -------------------------------------------------------------------
// We remove the import:
// import logoSrc from '../../assets/furuhalls-logo.png'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Define the logo source using the absolute public path
  const logoSrc = '/furuhalls-logo.png';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          {/* ✅ LOGO USES ABSOLUTE PATH */}
          <img src={logoSrc} alt="Furuhalls Logo" className="login-logo" />
          
          <h1>Furuhalls Flow</h1>
          <p>Order Tracking & Production</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>© {new Date().getFullYear()} Furuhalls. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;