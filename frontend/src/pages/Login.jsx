// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthModel from "../utils/AuthModel"; // Add this import

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Use AuthModel.login instead of direct fetch
      const data = await AuthModel.login(email, password);
      navigate("/inside");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    }
  };

  // Animation variants for page transitions
  const pageVariants = {
    initial: {
      opacity: 0,
      x: "-100%", // Slide in from left
    },
    animate: {
      opacity: 1,
      x: 0, // Slide to center
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: "100%", // Slide out to right
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    },
  };
  return (
    // Wrap the container in motion.div for animation
    <motion.div
      className="container_login"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="image-section_login"></div>
      <div className="form-section_login">
        <div className="logo_login">
          <span>♪</span> PassanGo
        </div>
        <div className="form-wrapper_login">
          <form id="login-form_login" onSubmit={handleSubmit}>
            <h2>Log In</h2>
            {error && (
              <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            )}
            <label htmlFor="email">Email</label>
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
              <a href="#" onClick={() => navigate("/forgot-password")}>
                Forgot Password?
              </a>
            </p>
            <p>
              Don't have an account?{" "}
              <a href="#" onClick={() => navigate("/signup")}>
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default Login;
