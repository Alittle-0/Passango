// src/pages/Signup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Added for animations
import AuthModel from '../models/AuthModel';

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
  
      await AuthModel.signup(email, username, password);
      navigate('/inside');
    } catch (err) {
      console.error('Signup error:', err);
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