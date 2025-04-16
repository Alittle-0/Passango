// src/App.jsx
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./appRoutes/Routes";
import axios from "axios";
import "./styles/main.scss";
import { useEffect } from "react";

function App() {
  // Function to test the API connection using axios
  const fetchAPI = async () => {
    try {
      const response = await axios.get('/api/auth/test');
      console.log('API Test Response:', response.data);
    } catch (error) {
      console.error('API Test Error:', error.response ? error.response.data : error.message);
    }
  };

  // Call fetchAPI when the component mounts
  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;