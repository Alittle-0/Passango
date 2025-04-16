// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Form data:', { email, password });

    const requestData = { email, password };
    console.log('Sending login request with:', requestData);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      console.log('Storing token:', data.token);
      console.log('Storing user:', data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      console.log('Navigating to /inside');
      navigate('/inside');
    } catch (err) {
      console.error('Login error:', err);
      console.log('Error message:', err.message);
      setError(err.message);
    }
  };

  return (
    <div className="container_login">
      <div className="image-section_login"></div>
      <div className="form-section_login">
        <div className="logo_login">
          <span>♪</span> PassanGo
        </div>
        <div className="form-wrapper_login">
          <form id="login-form_login" onSubmit={handleSubmit}>
            <h2>Log In</h2>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <label htmlFor="email">Email/Name</label>
            <input
              type="text"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="checkbox-label">
              <input type="checkbox" id="remember-me" /> Remember me
            </label>
            <button type="submit" className="button_login">
              Log In
            </button>
            <p>
              <a href="#" onClick={() => navigate('/forgot-password')}>
                Forgot Password?
              </a>
            </p>
            <p>
              Don't have an account?{' '}
              <a href="#" onClick={() => navigate('/signup')}>
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
      
    </div>
  );
}

export default Login;