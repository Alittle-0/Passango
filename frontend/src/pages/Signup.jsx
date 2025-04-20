// src/pages/Signup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Added for animations

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = { email, username, password, confirmPassword };
    console.log('Form data:', requestData);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      console.log('Validation error: Passwords do not match');
      return;
    }

    // Username length validation
  if (username.length < 4 || username.length > 20) {
    setError('Username must be between 4 and 20 characters');
    console.log('Validation error: Username length invalid');
    return;
  }
    
    // Check if API URL is defined
    if (!import.meta.env.VITE_API_URL) {
      console.error('VITE_API_URL is not defined in environment variables');
      setError('Server configuration error. Please contact support.');
      return;
    }

    const apiUrl = `${import.meta.env.VITE_API_URL}/api/auth/signup`;
    console.log('Sending signup request to:', apiUrl);
    console.log('Request data:', requestData);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);

      // Get the raw response text first
      const responseText = await response.text();
      console.log('Raw response text:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        console.error('Response text that failed to parse:', responseText);
        throw new Error('Invalid JSON response from server');
      }

      console.log('Parsed response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Sign-up failed');
      }

      console.log('Signup successful, storing token and user data');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      console.log('Navigating to /inside');
      navigate('/inside');
    } catch (err) {
      console.error('Signup error:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack
      });
      setError(err.message);
    }
  };
  // Animation variants for page transitions
  const pageVariants = {
    initial: {
      opacity: 0,
      x: '100%', // Slide in from right
    },
    animate: {
      opacity: 1,
      x: 0, // Slide to center
      transition: {
        duration: 0.7,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      x: '-100%', // Slide out to left
      transition: {
        duration: 0.5,
        ease: 'easeIn',
      },
    },
  };

  return (
    // Wrap the container in motion.div for animation
    <motion.div
      className="container_signup"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="form-section_signup">
        <div className="logo_signup">
          <span>♪</span> PassanGo
        </div>
        <div className="form-wrapper_signup">
          <form id="signup-form_signup" onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <label htmlFor="signup-email">Email</label>
            <input
              type="email"
              id="signup-email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="signup-username">Username</label>
            <input
              type="text"
              id="signup-username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="signup-password">Password</label>
            <input
              type="password"
              id="signup-password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="signup-confirm-password">Confirm Password</label>
            <input
              type="password"
              id="signup-confirm-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className="button_signup">
              Sign Up
            </button>
            <p>
              Already have an account?{' '}
              <a href="#" onClick={() => navigate('/login')}>
                Log In
              </a>
            </p>
          </form>
        </div>
      </div>
      <div className="image-section_signup"></div>
    </motion.div>
  );
}

export default Signup;