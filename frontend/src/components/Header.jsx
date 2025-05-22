// src/components/Header.jsx
import React, { useState, useEffect } from "react"; // Import useEffect from react
import { useNavigate } from "react-router-dom"; // Only import navigation-related hooks from react-router-dom
import SearchBar from "../components/SearchBar";

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial user load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Listen for user updates
    const handleUserUpdate = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) {
        setUser(JSON.parse(updatedUser));
      }
    };

    window.addEventListener("userUpdated", handleUserUpdate);
    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/about");
  };

  return (
    //Change "#"
    <header>
      <div className="logo_header">
        <img src="public/images/LOGO (1).png" alt="PassanGo" />
        <h1>PassanGo</h1>
      </div>
      <SearchBar />
      <nav>
        <ul>
          {user ? (
            <>
              <li>
                <a href="/inside" className="Header_a">
                  Home
                </a>
              </li>
              <li>
                <a href="/create" className="Header_a">
                  Create
                </a>
              </li>
              <li>
                <div className="user-profile">
                  <img
                    src={
                      user.avatar?.data
                        ? `data:${user.avatar.contentType};base64,${user.avatar.data}`
                        : "/images/default_avatar.png"
                    }
                    alt="User Avatar"
                    className="header-avatar"
                    onClick={() => navigate("/profile")}
                  />
                </div>
              </li>
              <li>
                <a href="#" onClick={handleLogout}>
                  Logout
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="/" className="Header_a">
                  Home
                </a>
              </li>
              <li>
                <a href="/login" className="Header_a">
                  Log In
                </a>
              </li>
              <li>
                <a href="/signup" className="Header_a">
                  Sign Up
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
