import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModel from '../../models/AuthModel';
import PasswordStrengthMeter from '../../components/PasswordStrengthMeter';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await AuthModel.requestPasswordReset(email);
            setMessage('Password reset instructions have been sent to your email');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.message || 'Failed to send reset instructions');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Forgot Password</h2>
                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Instructions'}
                    </button>
                </form>

                <div className="auth-links">
                    <p>
                        Remember your password?{' '}
                        <button 
                            className="link-button"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword; 