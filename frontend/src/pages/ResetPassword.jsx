// src/pages/ResetPassword.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const tempToken = location.state?.tempToken || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!tempToken || !newPassword) {
      setError('Token and new password are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        tempToken,
        newPassword,
      });
      setSuccess(response.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="container">
      <div className="form-section">
        <div className="logo">
          <span>♪</span> PassanGo
        </div>
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <h2>Reset Password</h2>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-login">
              Reset Password
            </button>
            <p>
              <a href="#" onClick={() => navigate('/login')}>
                Back to Login
              </a>
            </p>
          </form>
        </div>
      </div>
      <div className="image-section"></div>
    </div>
  );
}

export default ResetPassword;