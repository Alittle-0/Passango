import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Loading from "../pages/Loading"; // Assuming you have a Loading component

function Protected({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth verification error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, [navigate]);

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default Protected;
