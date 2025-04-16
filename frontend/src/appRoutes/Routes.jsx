// src/appRoutes/Routes.jsx
import { Routes, Route } from 'react-router-dom';
import GetStarted from '../pages/GetStarted';
import About from '../pages/About';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Inside from '../pages/Inside';
import Create from '../pages/Create';
import Profile from '../pages/Profile';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GetStarted />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/inside" element={<Inside />} />
      <Route path="/create" element={<Create />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default AppRoutes;