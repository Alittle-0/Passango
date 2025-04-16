// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      setSuccess(data.message);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="container_forgot">
      <div className='forgot_pic'>
        <img src="/images/forgot_main.png" alt="Forgot Password" />
      </div>
      <div className="form-section_forgot">
        <div className="logo">
          <h2>Did You Forget Your Password?</h2>
        </div>
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
            <label htmlFor="email"><h3>Enter Your Email To Reset</h3></label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="button_forgot">
              Send Reset Link
            </button>
            <p>
              <a href="#" onClick={() => navigate('/login')}>
                Back to Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;